import { Injectable, ConflictException, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ICheckoutService } from '../interfaces/checkout-service.interface';
import { PaymentGatewayResponse, PaymentGatewayInfo } from '../payment-gateway/interfaces/payment-gateway.interface';
import { CheckoutDto } from '../dto/checkout.dto';
import { User } from '../../user/entities/user.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { ProfilePf } from '../../profile/entities/profile-pf.entity';
import { ProfilePj } from '../../profile/entities/profile-pj.entity';
import { Address } from '../../address/entities/address.entity';
import { Phone } from '../../phone/entities/phone.entity';
import { Card } from '../../card/entities/card.entity';
import { ProfileType } from '../../../common/enums/profile-type.enum';

export interface CheckoutResult {
  userId: number;
  profileId: number;
  addressId: number;
  phoneId: number;
  cardId?: number;
  cardToken?: string;
  accessToken: string;
}

interface JwtPayload {
  sub: number;
  email: string;
  profileId: number;
  profileType: ProfileType;
}

@Injectable()
export class CheckoutsService implements ICheckoutService {
  private readonly DEFAULT_GATEWAY = 'cielo';

  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async processCheckout(dto: CheckoutDto, authHeader?: string): Promise<CheckoutResult> {
    if (dto.isRegistered) {
      const tokenPayload = this.validateAndExtractToken(authHeader);
      return this.processRegisteredCheckout(dto, tokenPayload);
    }
    return this.processNewUserCheckout(dto);
  }

  private validateAndExtractToken(authHeader?: string): JwtPayload {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação obrigatório para usuários registrados');
    }

    try {
      const token = authHeader.substring(7);
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private async processRegisteredCheckout(dto: CheckoutDto, tokenPayload: JwtPayload): Promise<CheckoutResult> {
    if (tokenPayload.sub !== tokenPayload.sub || tokenPayload.profileId !== tokenPayload.profileId) {
      throw new ForbiddenException('Dados do token não correspondem ao usuário');
    }

    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: tokenPayload.sub }
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const profile = await this.dataSource.getRepository(Profile).findOne({
      where: { id: tokenPayload.profileId, userId: tokenPayload.sub }
    });
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const result = await this.dataSource.transaction(async (manager) => {
      await this.updateProfile(manager, profile.id, dto);

      const address = await this.resolveAddress(manager, profile.id, dto);
      const phone = await this.resolvePhone(manager, profile.id, dto);
      const card = await this.resolveCard(manager, profile.id, dto, false);

      return { address, phone, card };
    });

    return {
      userId: user.id,
      profileId: profile.id,
      addressId: result.address.id,
      phoneId: result.phone.id,
      cardId: result.card?.id,
      cardToken: dto.card?.cardToken,
      accessToken: this.jwtService.sign({
        email: user.email,
        sub: user.id,
        profileId: profile.id,
        profileType: dto.profileType,
      }),
    };
  }

  private async processNewUserCheckout(dto: CheckoutDto): Promise<CheckoutResult> {
    await this.validateNewUserData(dto);

    const result = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const profileRepo = manager.getRepository(Profile);

      const hashedPassword = await bcrypt.hash(dto.password!, 10);
      const user = await userRepo.save(userRepo.create({ 
        email: dto.email!, 
        password: hashedPassword 
      }));

      const profile = await profileRepo.save(profileRepo.create({
        userId: user.id,
        profileType: dto.profileType,
      }));

      await this.createProfileDetails(manager, profile.id, dto);

      const address = await this.createAddress(manager, profile.id, dto, true);
      const phone = await this.createPhone(manager, profile.id, dto, true);
      const card = await this.resolveCard(manager, profile.id, dto, true);

      return { user, profile, address, phone, card };
    });

    return {
      userId: result.user.id,
      profileId: result.profile.id,
      addressId: result.address.id,
      phoneId: result.phone.id,
      cardId: result.card?.id,
      cardToken: dto.card?.cardToken,
      accessToken: this.jwtService.sign({
        email: result.user.email,
        sub: result.user.id,
        profileId: result.profile.id,
        profileType: dto.profileType,
      }),
    };
  }

  private async updateProfile(manager: EntityManager, profileId: number, dto: CheckoutDto): Promise<void> {
    if (dto.profileType === ProfileType.PF) {
      const pfData = dto.profile as any;
      await manager.getRepository(ProfilePf).update(
        { profileId },
        {
          firstName: pfData.firstName,
          lastName: pfData.lastName,
          cpf: pfData.cpf,
          birthDate: new Date(pfData.birthDate),
          gender: pfData.gender,
        }
      );
    } else {
      const pjData = dto.profile as any;
      await manager.getRepository(ProfilePj).update(
        { profileId },
        {
          companyName: pjData.companyName,
          cnpj: pjData.cnpj,
          tradingName: pjData.tradingName,
          stateRegistration: pjData.stateRegistration,
          municipalRegistration: pjData.municipalRegistration,
        }
      );
    }
  }

  private async createProfileDetails(manager: EntityManager, profileId: number, dto: CheckoutDto): Promise<void> {
    if (dto.profileType === ProfileType.PF) {
      const pfData = dto.profile as any;
      await manager.getRepository(ProfilePf).save(
        manager.getRepository(ProfilePf).create({
          profileId,
          firstName: pfData.firstName,
          lastName: pfData.lastName,
          cpf: pfData.cpf,
          birthDate: new Date(pfData.birthDate),
          gender: pfData.gender,
        })
      );
    } else {
      const pjData = dto.profile as any;
      await manager.getRepository(ProfilePj).save(
        manager.getRepository(ProfilePj).create({
          profileId,
          companyName: pjData.companyName,
          cnpj: pjData.cnpj,
          tradingName: pjData.tradingName,
          stateRegistration: pjData.stateRegistration,
          municipalRegistration: pjData.municipalRegistration,
        })
      );
    }
  }

  private async resolveAddress(manager: EntityManager, profileId: number, dto: CheckoutDto): Promise<Address> {
    const addressRepo = manager.getRepository(Address);
    const isDefault = dto.address.isDefault ?? false;

    if (dto.address.id) {
      const existingAddress = await addressRepo.findOne({
        where: { id: dto.address.id, profileId }
      });

      if (existingAddress) {
        return this.updateAddress(manager, existingAddress, dto, isDefault);
      }
    }

    return this.createAddress(manager, profileId, dto, isDefault || !dto.address.id);
  }

  private async updateAddress(manager: EntityManager, address: Address, dto: CheckoutDto, isDefault: boolean): Promise<Address> {
    const addressRepo = manager.getRepository(Address);
    const updateData: Partial<Address> = {};

    if (dto.address.street) updateData.street = dto.address.street;
    if (dto.address.number) updateData.number = dto.address.number;
    if (dto.address.complement !== undefined) updateData.complement = dto.address.complement;
    if (dto.address.neighborhood) updateData.neighborhood = dto.address.neighborhood;
    if (dto.address.city) updateData.city = dto.address.city;
    if (dto.address.state) updateData.state = dto.address.state;
    if (dto.address.zipCode) updateData.zipCode = dto.address.zipCode;

    if (isDefault) {
      await this.clearDefaultAddresses(manager, address.profileId);
      updateData.isDefault = true;
    }

    if (Object.keys(updateData).length > 0) {
      await addressRepo.update({ id: address.id }, updateData);
      Object.assign(address, updateData);
    }

    return address;
  }

  private async createAddress(manager: EntityManager, profileId: number, dto: CheckoutDto, isDefault: boolean): Promise<Address> {
    const addressRepo = manager.getRepository(Address);

    if (isDefault) {
      await this.clearDefaultAddresses(manager, profileId);
    }

    return addressRepo.save(addressRepo.create({
      profileId,
      street: dto.address.street!,
      number: dto.address.number!,
      complement: dto.address.complement,
      neighborhood: dto.address.neighborhood!,
      city: dto.address.city!,
      state: dto.address.state!,
      zipCode: dto.address.zipCode!,
      isDefault,
    }));
  }

  private async clearDefaultAddresses(manager: EntityManager, profileId: number): Promise<void> {
    await manager.getRepository(Address).update(
      { profileId, isDefault: true },
      { isDefault: false }
    );
  }

  private async resolvePhone(manager: EntityManager, profileId: number, dto: CheckoutDto): Promise<Phone> {
    const phoneRepo = manager.getRepository(Phone);
    const isDefault = dto.phone.isDefault ?? false;

    if (dto.phone.id) {
      const existingPhone = await phoneRepo.findOne({
        where: { id: dto.phone.id, profileId }
      });

      if (existingPhone) {
        return this.updatePhone(manager, existingPhone, dto, isDefault);
      }
    }

    return this.createPhone(manager, profileId, dto, isDefault || !dto.phone.id);
  }

  private async updatePhone(manager: EntityManager, phone: Phone, dto: CheckoutDto, isDefault: boolean): Promise<Phone> {
    const phoneRepo = manager.getRepository(Phone);
    const updateData: Partial<Phone> = {};

    if (dto.phone.ddd) updateData.ddd = dto.phone.ddd;
    if (dto.phone.number) updateData.number = dto.phone.number;

    if (isDefault) {
      await this.clearDefaultPhones(manager, phone.profileId);
      updateData.isDefault = true;
    }

    if (Object.keys(updateData).length > 0) {
      await phoneRepo.update({ id: phone.id }, updateData);
      Object.assign(phone, updateData);
    }

    return phone;
  }

  private async createPhone(manager: EntityManager, profileId: number, dto: CheckoutDto, isDefault: boolean): Promise<Phone> {
    const phoneRepo = manager.getRepository(Phone);

    if (isDefault) {
      await this.clearDefaultPhones(manager, profileId);
    }

    return phoneRepo.save(phoneRepo.create({
      profileId,
      ddd: dto.phone.ddd!,
      number: dto.phone.number!,
      isDefault,
      verified: false,
    }));
  }

  private async clearDefaultPhones(manager: EntityManager, profileId: number): Promise<void> {
    await manager.getRepository(Phone).update(
      { profileId, isDefault: true },
      { isDefault: false }
    );
  }

  private async resolveCard(manager: EntityManager, profileId: number, dto: CheckoutDto, isNewUser: boolean): Promise<Card | null> {
    if (!dto.card?.saveCard) {
      return null;
    }

    const cardRepo = manager.getRepository(Card);
    const isDefault = isNewUser || (dto.card.isDefault ?? false);

    if (isDefault) {
      await this.clearDefaultCards(manager, profileId);
    }

    return cardRepo.save(cardRepo.create({
      profileId,
      lastFourDigits: dto.card.lastFourDigits!,
      holderName: this.maskHolderName(dto.card.holderName!),
      expirationMonth: dto.card.expirationMonth!,
      expirationYear: dto.card.expirationYear!,
      brand: dto.card.brand!,
      cardToken: dto.card.cardToken,
      isDefault,
    }));
  }

  private async clearDefaultCards(manager: EntityManager, profileId: number): Promise<void> {
    await manager.getRepository(Card).update(
      { profileId, isDefault: true },
      { isDefault: false }
    );
  }

  private async validateNewUserData(dto: CheckoutDto): Promise<void> {
    const existingUser = await this.dataSource.getRepository(User).findOne({
      where: { email: dto.email }
    });
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    if (dto.profileType === ProfileType.PF) {
      const pfData = dto.profile as any;
      const existingCpf = await this.dataSource.getRepository(ProfilePf).findOne({
        where: { cpf: pfData.cpf }
      });
      if (existingCpf) {
        throw new ConflictException('CPF já cadastrado');
      }
    } else {
      const pjData = dto.profile as any;
      const existingCnpj = await this.dataSource.getRepository(ProfilePj).findOne({
        where: { cnpj: pjData.cnpj }
      });
      if (existingCnpj) {
        throw new ConflictException('CNPJ já cadastrado');
      }
    }
  }

  validateCheckout(profileId: number, gatewayName?: string): Promise<{ success: boolean; message: string; data: any; }> {
    throw new Error('Method not implemented.');
  }

  tempCheckout(): Promise<{ success: boolean; message: string; data: any; }> {
    throw new Error('Method not implemented.');
  }

  processPayment(profileId: number, paymentMethod: string, customerData: any, address: string): Promise<PaymentGatewayResponse> {
    throw new Error('Method not implemented.');
  }

  getAvailablePaymentGateways(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }

  getPaymentGatewaysInfo(): Promise<{ [key: string]: PaymentGatewayInfo; }> {
    throw new Error('Method not implemented.');
  }

  private maskHolderName(name: string): string {
    const parts = name.trim().split(' ').filter(p => p.length > 0);
    
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].toUpperCase();
    
    const firstName = parts[0].toUpperCase();
    const lastInitial = parts[parts.length - 1][0].toUpperCase();
    
    return `${firstName} ${lastInitial}.`;
  }
}
