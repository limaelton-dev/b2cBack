import { Injectable, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ICheckoutService } from '../interfaces/checkout-service.interface';
import { PaymentGatewayResponse, PaymentGatewayInfo } from '../payment-gateway/interfaces/payment-gateway.interface';
import { GuestCheckoutDto } from '../dto/guest-checkout.dto';
import { User } from '../../user/entities/user.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { ProfilePf } from '../../profile/entities/profile-pf.entity';
import { ProfilePj } from '../../profile/entities/profile-pj.entity';
import { Address } from '../../address/entities/address.entity';
import { Phone } from '../../phone/entities/phone.entity';
import { Card } from '../../card/entities/card.entity';
import { ProfileType } from '../../../common/enums/profile-type.enum';

export interface GuestCheckoutResult {
  user: {
    id: number;
    email: string;
  };
  profileId: number;
  addressId: number;
  phoneId: number;
  cardId: number;
  accessToken: string;
}

@Injectable()
export class CheckoutsService implements ICheckoutService {
  private readonly DEFAULT_GATEWAY = 'cielo';

  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async registerGuest(dto: GuestCheckoutDto): Promise<GuestCheckoutResult> {
    await this.validateGuestData(dto);

    const result = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const profileRepo = manager.getRepository(Profile);
      const profilePfRepo = manager.getRepository(ProfilePf);
      const profilePjRepo = manager.getRepository(ProfilePj);
      const addressRepo = manager.getRepository(Address);
      const phoneRepo = manager.getRepository(Phone);
      const cardRepo = manager.getRepository(Card);

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await userRepo.save(userRepo.create({ 
        email: dto.email, 
        password: hashedPassword 
      }));

      const profile = await profileRepo.save(profileRepo.create({
        userId: user.id,
        profileType: dto.profileType,
      }));

      if (dto.profileType === ProfileType.PF) {
        const pfData = dto.profile as any;
        await profilePfRepo.save(profilePfRepo.create({
          profileId: profile.id,
          firstName: pfData.firstName,
          lastName: pfData.lastName,
          cpf: pfData.cpf,
          birthDate: new Date(pfData.birthDate),
          gender: pfData.gender,
        }));
      } else {
        const pjData = dto.profile as any;
        await profilePjRepo.save(profilePjRepo.create({
          profileId: profile.id,
          companyName: pjData.companyName,
          cnpj: pjData.cnpj,
          tradingName: pjData.tradingName,
          stateRegistration: pjData.stateRegistration,
          municipalRegistration: pjData.municipalRegistration,
        }));
      }

      const address = await addressRepo.save(addressRepo.create({
        profileId: profile.id,
        street: dto.address.street,
        number: dto.address.number,
        complement: dto.address.complement,
        neighborhood: dto.address.neighborhood,
        city: dto.address.city,
        state: dto.address.state,
        zipCode: dto.address.zipCode,
        isDefault: true,
      }));

      const phone = await phoneRepo.save(phoneRepo.create({
        profileId: profile.id,
        ddd: dto.phone.ddd,
        number: dto.phone.number,
        isDefault: true,
        verified: false,
      }));

      const card = await cardRepo.save(cardRepo.create({
        profileId: profile.id,
        lastFourDigits: dto.card.lastFourDigits,
        holderName: this.maskHolderName(dto.card.holderName),
        expirationMonth: dto.card.expirationMonth,
        expirationYear: dto.card.expirationYear,
        brand: dto.card.brand,
        isDefault: true,
      }));

      return { user, profile, address, phone, card };
    });

    const payload = {
      email: result.user.email,
      sub: result.user.id,
      profileId: result.profile.id,
      profileType: dto.profileType,
    };

    return {
      user: { id: result.user.id, email: result.user.email },
      profileId: result.profile.id,
      addressId: result.address.id,
      phoneId: result.phone.id,
      cardId: result.card.id,
      accessToken: this.jwtService.sign(payload),
    };
  }

  private async validateGuestData(dto: GuestCheckoutDto): Promise<void> {
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