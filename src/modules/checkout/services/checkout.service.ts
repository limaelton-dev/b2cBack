import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { GuestCheckoutDto } from '../dto/guest-checkout.dto';
import { RegisteredCheckoutDto } from '../dto/registered-checkout.dto';
import { CreateOrderDto, OrderResult } from '../dto/create-order.dto';
import { User } from '../../user/entities/user.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { ProfilePf } from '../../profile/entities/profile-pf.entity';
import { ProfilePj } from '../../profile/entities/profile-pj.entity';
import { Address } from '../../address/entities/address.entity';
import { Phone } from '../../phone/entities/phone.entity';
import { Card } from '../../card/entities/card.entity';
import { Order } from '../../orders/entities/order.entity';
import { ProfileType } from '../../../common/enums/profile-type.enum';
import { CartsService } from '../../carts/services/carts.service';
import { OrdersRepository } from '../../orders/repositories/orders.repository';
import { OrdersAnymarketRepository } from '../../orders/repositories/orders-anymarket.repository';
import { ProductsService } from '../../products/services/products.service';
import { ShippingService } from '../../shipping/services/shipping.service';
import { calculateItemsTotal, calculateGrandTotal } from '../../../common/helpers/price.util';

export interface GuestCheckoutResult {
  userId: number;
  profileId: number;
  accessToken: string;
}

export interface RegisteredCheckoutResult {
  profileId: number;
  addressId: number;
  phoneId: number;
  cardId?: number;
}

@Injectable()
export class CheckoutService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly cartsService: CartsService,
    private readonly ordersRepository: OrdersRepository,
    private readonly ordersAnymarketRepository: OrdersAnymarketRepository,
    private readonly productsService: ProductsService,
    private readonly shippingService: ShippingService,
  ) {}

  async processGuestCheckout(dto: GuestCheckoutDto): Promise<GuestCheckoutResult> {
    await this.validateNewUserData(dto);

    const result = await this.dataSource.transaction(async (manager) => {
      const user = await this.createUser(manager, dto.email, dto.password);
      const profile = await this.createProfile(manager, user.id, dto.profileType);
      await this.createProfileDetails(manager, profile.id, dto.profileType, dto.profile);
      await this.createAddress(manager, profile.id, dto.address, true);
      await this.createPhone(manager, profile.id, dto.phone, true);
      
      if (dto.card?.saveCard) {
        await this.createCard(manager, profile.id, dto.card);
      }

      return { user, profile };
    });

    return {
      userId: result.user.id,
      profileId: result.profile.id,
      accessToken: this.generateToken(result.user, result.profile, dto.profileType),
    };
  }

  //se recebermos profile, aqui precisamos também receber profile ID e validar se é o mesmo ID para segurança de atualização.
  async processRegisteredCheckout(dto: RegisteredCheckoutDto, profileId: number): Promise<RegisteredCheckoutResult> {
    const profile = await this.dataSource.getRepository(Profile).findOne({
      where: { id: profileId }
    });
    
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const result = await this.dataSource.transaction(async (manager) => {
      //aqui poderiamos cometer o erro de atualizar informações de um usuário que não é o mesmo da request, dando margem para ataques
      await this.updateProfileDetails(manager, profileId, dto.profileType, dto.profile);
      const address = await this.resolveAddress(manager, profileId, dto.address);
      const phone = await this.resolvePhone(manager, profileId, dto.phone);
      
      let card: Card | null = null;
      if (dto.card?.saveCard) {
        card = await this.createCard(manager, profileId, dto.card);
      }

      return { address, phone, card };
    });

    return {
      profileId,
      addressId: result.address.id,
      phoneId: result.phone.id,
      cardId: result.card?.id,
    };
  }

  async createOrder(
    profileId: number,
    dto: CreateOrderDto,
    idempotencyKey?: string,
  ): Promise<OrderResult> {
    if (idempotencyKey) {
      const existing = await this.dataSource.getRepository(Order).findOne({
        where: { checkoutKey: idempotencyKey },
      });
      if (existing) {
        return this.mapOrderToResult(existing);
      }
      //se existir a chave, mas não encontrar a order, continua.
    }
    //e se não existir uma idempotencyKey, continua execução

    const cartDetails = await this.cartsService.findWithDetails(profileId);
    
    if (!cartDetails.items.length) {
      throw new BadRequestException('Carrinho vazio');
    }

    const unavailableItems = cartDetails.items.filter(i => !i.available);
    if (unavailableItems.length > 0) {
      throw new BadRequestException('Existem itens indisponíveis no carrinho, remova para continuar');
    }

    const profile = await this.dataSource.getRepository(Profile).findOne({
      where: { id: profileId },
      relations: ['profilePf', 'profilePj', 'user'],
    });

    if (!profile) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const shippingAddress = await this.resolveShippingAddress(profileId, dto);
    const itemsTotal = cartDetails.subtotal;
    const shippingTotal = await this.calculateShipping(dto, shippingAddress, cartDetails.items);
    const discountTotal = 0;
    const grandTotal = calculateGrandTotal(itemsTotal, shippingTotal, discountTotal);

    const partnerOrderId = this.generatePartnerOrderId(profileId);

    const anymarketPayload = await this.buildAnymarketPayload(
      partnerOrderId,
      profile,
      shippingAddress,
      cartDetails.items,
      itemsTotal,
      shippingTotal,
      discountTotal,
      grandTotal,
    );

    //TODO: verificar uma estratégia, pois não temos controle sobre o servidor externo(anymarket)
    const anymarketOrder = await this.ordersAnymarketRepository.create(anymarketPayload);

    const orderData: Partial<Order> = {
      profileId,
      checkoutKey: idempotencyKey || null,
      anymarketOrderId: anymarketOrder.id, //aqui, por enquanto usamos await, porém temos que tratar isso em caso de instabilidade
      partnerOrderId,
      marketplace: 'ECOMMERCE',
      status: 'WAITING_PAYMENT',
      itemsTotal: itemsTotal.toFixed(2),
      shippingTotal: shippingTotal.toFixed(2),
      discountTotal: discountTotal.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      paymentMethod: 'PENDING',
      anymarketRawPayload: anymarketOrder,//aqui, por enquanto usamos await, porém temos que tratar isso em caso de instabilidade
      anymarketCreatedAt: anymarketOrder.createdAt ? new Date(anymarketOrder.createdAt) : null,
    };

    const itemsData = cartDetails.items.map((item) => ({
      productId: 0,
      skuId: item.skuId,
      title: item.sku?.title ?? '',
      quantity: item.quantity,
      unitPrice: (item.sku as any)?._rawPrice?.toFixed(2) ?? '0.00',
      discount: '0.00', //tranquili, mas quando estivermos no módulo de desconto, precisamos ver isso
      total: ((item.sku as any)?._rawPrice * item.quantity).toFixed(2),
    }));

    const order = await this.ordersRepository.createOrderWithItemsAndStatusHistory(
      orderData,
      itemsData,
      'SYSTEM',
    );

    return this.mapOrderToResult(order);
  }

  private mapOrderToResult(order: Order): OrderResult {
    return {
      orderId: order.id,
      partnerOrderId: order.partnerOrderId ?? '',
      status: order.status,
      itemsTotal: order.itemsTotal,
      shippingTotal: order.shippingTotal,
      discountTotal: order.discountTotal,
      grandTotal: order.grandTotal,
    };
  }

  private async resolveShippingAddress(profileId: number, dto: CreateOrderDto): Promise<Address> {
    if (dto.shippingAddressOverride) {
      const tempAddress = new Address();
      Object.assign(tempAddress, dto.shippingAddressOverride);
      tempAddress.profileId = profileId;
      return tempAddress;
    }

    const addressRepo = this.dataSource.getRepository(Address);
    
    if (dto.shippingAddressId) {
      const address = await addressRepo.findOne({
        where: { id: dto.shippingAddressId, profileId },
      });
      if (!address) {
        throw new BadRequestException('Endereço de entrega não encontrado');
      }
      return address;
    }

    const defaultAddress = await addressRepo.findOne({
      where: { profileId, isDefault: true },
    });

    if (!defaultAddress) {
      const anyAddress = await addressRepo.findOne({ where: { profileId } });
      if (!anyAddress) {
        throw new BadRequestException('Nenhum endereço cadastrado');
      }
      return anyAddress;
    }

    return defaultAddress;
  }


  //TODO: verificar esse método(Não apagar ou resolver isso já)...
  private async calculateShipping(
    dto: CreateOrderDto,
    address: Address,
    items: any[],
  ): Promise<number> {
    try {
      const destZip = address.zipCode?.replace(/\D/g, '');
      if (!destZip) return 0;

      const originZip = '01001000';
      const shippingItems = items.map((item) => ({
        productId: item.skuId,
        serviceCode: dto.shippingOptionCode ?? '',
        quantity: item.quantity,
        weight: 0,
        dimensions: undefined,
      }));

      //TODO: ta sem modo simulação, vamos ajustar isso também depois de finalizar módulo de shipping.(não remover esse comentário)
      const response = await this.shippingService.calculateShipping(
        'simulation',
        originZip,
        destZip,
        shippingItems,
      );

      if (response.success && response.data) {
        return Number(response.data.totalPrice);
      }
    } catch {
      // fallback
    }
    return 0;
  }

  private generatePartnerOrderId(profileId: number): string {
    return `ECOM-${profileId}-${Date.now()}`;
  }

  private async buildAnymarketPayload(
    partnerOrderId: string,
    profile: Profile,
    shippingAddress: Address,
    items: any[],
    itemsTotal: number,
    shippingTotal: number,
    discountTotal: number,
    grandTotal: number,
  ) {
    const profilePf = profile.profilePf;
    const profilePj = profile.profilePj;
    const user = profile.user;

    const customerName = profilePf
      ? `${profilePf.firstName} ${profilePf.lastName}`
      : profilePj?.companyName ?? '';

    const document = profilePf
      ? { documentType: 'CPF', documentNumber: profilePf.cpf }
      : profilePj
        ? { documentType: 'CNPJ', documentNumber: profilePj.cnpj }
        : undefined;

    const skuIds = items.map((i) => i.skuId);
    const skuDetailsMap = await this.productsService.findSkusForCart(skuIds);

    const orderItems = items.map((item) => {
      const sku = skuDetailsMap.get(item.skuId);
      const unitPrice = sku?._rawPrice ?? 0;
      return {
        sku: sku?.partnerId ? String(sku.partnerId) : String(item.skuId),
        title: sku?.title ?? item.sku?.title ?? '',
        quantity: item.quantity,
        price: unitPrice,
        originalPrice: unitPrice,
        discount: 0,
      };
    });

    return {
      partnerId: partnerOrderId,
      marketplace: 'ECOMMERCE',
      customer: {
        name: customerName,
        email: user?.email ?? '',
        phone: undefined,
        cellPhone: undefined,
        document,
        shippingAddress: {
          state: shippingAddress.state,
          city: shippingAddress.city,
          zipCode: shippingAddress.zipCode,
          neighborhood: shippingAddress.neighborhood,
          address: shippingAddress.street,
          number: shippingAddress.number,
          complement: shippingAddress.complement,
          reference: undefined,
        },
      },
      items: orderItems,
      payment: {
        paymentMethod: 'PENDING',
        //installments deve ser informado pelo usuário, aqui está fixo(pode gerar bug, ou tem outro motivo?)
        installments: 1,
        totalPaid: grandTotal,
      },
      shipping: {
        freightPrice: shippingTotal,
      },
      discountTotal,
      itemsTotal,
      grandTotal,
    };
  }

  private generateToken(user: User, profile: Profile, profileType: ProfileType): string {
    return this.jwtService.sign({
      email: user.email,
      sub: user.id,
      profileId: profile.id,
      profileType,
    });
  }

  private async validateNewUserData(dto: GuestCheckoutDto): Promise<void> {
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

  private async createUser(manager: EntityManager, email: string, password: string): Promise<User> {
    const userRepo = manager.getRepository(User);
    const hashedPassword = await bcrypt.hash(password, 10);
    return userRepo.save(userRepo.create({ email, password: hashedPassword }));
  }

  private async createProfile(manager: EntityManager, userId: number, profileType: ProfileType): Promise<Profile> {
    const profileRepo = manager.getRepository(Profile);
    return profileRepo.save(profileRepo.create({ userId, profileType }));
  }

  private async createProfileDetails(
    manager: EntityManager,
    profileId: number,
    profileType: ProfileType,
    profileData: any,
  ): Promise<void> {
    if (profileType === ProfileType.PF) {
      await manager.getRepository(ProfilePf).save(
        manager.getRepository(ProfilePf).create({
          profileId,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          cpf: profileData.cpf,
          birthDate: new Date(profileData.birthDate),
          gender: profileData.gender,
        })
      );
    } else {
      await manager.getRepository(ProfilePj).save(
        manager.getRepository(ProfilePj).create({
          profileId,
          companyName: profileData.companyName,
          cnpj: profileData.cnpj,
          tradingName: profileData.tradingName,
          stateRegistration: profileData.stateRegistration,
          municipalRegistration: profileData.municipalRegistration,
        })
      );
    }
  }

  private async updateProfileDetails(
    manager: EntityManager,
    profileId: number,
    profileType: ProfileType,
    profileData: any,
  ): Promise<void> {
    if (profileType === ProfileType.PF) {
      await manager.getRepository(ProfilePf).update(
        { profileId },
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          cpf: profileData.cpf,
          birthDate: new Date(profileData.birthDate),
          gender: profileData.gender,
        }
      );
    } else {
      await manager.getRepository(ProfilePj).update(
        { profileId },
        {
          companyName: profileData.companyName,
          cnpj: profileData.cnpj,
          tradingName: profileData.tradingName,
          stateRegistration: profileData.stateRegistration,
          municipalRegistration: profileData.municipalRegistration,
        }
      );
    }
  }

  private async createAddress(
    manager: EntityManager,
    profileId: number,
    addressData: any,
    isDefault: boolean,
  ): Promise<Address> {
    const addressRepo = manager.getRepository(Address);
    
    if (isDefault) {
      await addressRepo.update({ profileId, isDefault: true }, { isDefault: false });
    }

    return addressRepo.save(addressRepo.create({
      profileId,
      street: addressData.street,
      number: addressData.number,
      complement: addressData.complement,
      neighborhood: addressData.neighborhood,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      isDefault,
    }));
  }

  private async resolveAddress(
    manager: EntityManager,
    profileId: number,
    addressData: any,
  ): Promise<Address> {
    const addressRepo = manager.getRepository(Address);
    const isDefault = addressData.isDefault ?? false;

    if (addressData.id) {
      const existing = await addressRepo.findOne({
        where: { id: addressData.id, profileId }
      });
      if (existing) {
        const updateData: Partial<Address> = {};
        if (addressData.street) updateData.street = addressData.street;
        if (addressData.number) updateData.number = addressData.number;
        if (addressData.complement !== undefined) updateData.complement = addressData.complement;
        if (addressData.neighborhood) updateData.neighborhood = addressData.neighborhood;
        if (addressData.city) updateData.city = addressData.city;
        if (addressData.state) updateData.state = addressData.state;
        if (addressData.zipCode) updateData.zipCode = addressData.zipCode;

        if (isDefault) {
          await addressRepo.update({ profileId, isDefault: true }, { isDefault: false });
          updateData.isDefault = true;
        }

        if (Object.keys(updateData).length > 0) {
          await addressRepo.update({ id: existing.id }, updateData);
          Object.assign(existing, updateData);
        }
        return existing;
      }
    }

    return this.createAddress(manager, profileId, addressData, isDefault || !addressData.id);
  }

  private async createPhone(
    manager: EntityManager,
    profileId: number,
    phoneData: any,
    isDefault: boolean,
  ): Promise<Phone> {
    const phoneRepo = manager.getRepository(Phone);

    if (isDefault) {
      await phoneRepo.update({ profileId, isDefault: true }, { isDefault: false });
    }

    return phoneRepo.save(phoneRepo.create({
      profileId,
      ddd: phoneData.ddd,
      number: phoneData.number,
      isDefault,
      verified: false,
    }));
  }

  private async resolvePhone(
    manager: EntityManager,
    profileId: number,
    phoneData: any,
  ): Promise<Phone> {
    const phoneRepo = manager.getRepository(Phone);
    const isDefault = phoneData.isDefault ?? false;

    if (phoneData.id) {
      const existing = await phoneRepo.findOne({
        where: { id: phoneData.id, profileId }
      });
      if (existing) {
        const updateData: Partial<Phone> = {};
        if (phoneData.ddd) updateData.ddd = phoneData.ddd;
        if (phoneData.number) updateData.number = phoneData.number;

        if (isDefault) {
          await phoneRepo.update({ profileId, isDefault: true }, { isDefault: false });
          updateData.isDefault = true;
        }

        if (Object.keys(updateData).length > 0) {
          await phoneRepo.update({ id: existing.id }, updateData);
          Object.assign(existing, updateData);
        }
        return existing;
      }
    }

    return this.createPhone(manager, profileId, phoneData, isDefault || !phoneData.id);
  }

  private async createCard(
    manager: EntityManager,
    profileId: number,
    cardData: any,
  ): Promise<Card> {
    const cardRepo = manager.getRepository(Card);
    const isDefault = cardData.isDefault ?? true;

    if (isDefault) {
      await cardRepo.update({ profileId, isDefault: true }, { isDefault: false });
    }

    return cardRepo.save(cardRepo.create({
      profileId,
      lastFourDigits: cardData.lastFourDigits,
      holderName: this.maskHolderName(cardData.holderName),
      expirationMonth: cardData.expirationMonth,
      expirationYear: cardData.expirationYear,
      brand: cardData.brand,
      isDefault,
    }));
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
