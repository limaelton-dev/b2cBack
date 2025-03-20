import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersRepository } from '../repositories/orders.repository';
import { ProductsService } from '../../products/services/products.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';
import { ProfilesService } from '../../profiles/services/profiles.service';
import { DiscountsService } from '../../discounts/services/discounts.service';
import { OrderStatus } from '../../../common/enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsService: ProductsService,
    private readonly profilesService: ProfilesService,
    private readonly discountsService: DiscountsService,
  ) {}

  async create(profileId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    // Verificar se o perfil existe
    await this.profilesService.findOne(profileId);
    
    // Verificar se os produtos existem
    const productIds = createOrderDto.items.map(item => item.productId);
    const products = await this.productsService.findByIds(productIds);
    
    if (products.length !== productIds.length) {
      throw new BadRequestException('Um ou mais produtos não foram encontrados');
    }
    
    // Verificar desconto, se fornecido
    if (createOrderDto.discountId) {
      await this.discountsService.findOne(createOrderDto.discountId);
    }
    
    // Calcular total do pedido
    let total = 0;
    for (const item of createOrderDto.items) {
      const product = products.find(p => p.id === item.productId);
      total += product.price * item.quantity;
    }
    
    // Aplicar desconto, se houver
    let finalTotal = total;
    if (createOrderDto.discountId) {
      const discount = await this.discountsService.findOne(createOrderDto.discountId);
      if (discount.percentage) {
        finalTotal = total * (1 - discount.percentage / 100);
      } else if (discount.fixedAmount) {
        finalTotal = total - discount.fixedAmount;
      }
      
      // Garantir que o valor não seja negativo
      finalTotal = Math.max(0, finalTotal);
    }
    
    // Criar o pedido
    const order = await this.ordersRepository.create({
      profileId,
      totalPrice: finalTotal,
      status: OrderStatus.PENDING,
      fullAddress: createOrderDto.fullAddress,
      discountId: createOrderDto.discountId,
    });
    
    // Criar os itens do pedido
    if (order && order.id) {
      for (const item of createOrderDto.items) {
        const product = products.find(p => p.id === item.productId);
        await this.ordersRepository.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          totalPrice: product.price * item.quantity,
        });
      }
    }
    
    // Retornar o pedido completo com itens
    return this.ordersRepository.findOne(order.id);
  }

  async findAll(profileId: number): Promise<Order[]> {
    // Verificar se o perfil existe
    await this.profilesService.findOne(profileId);
    
    return this.ordersRepository.findByProfileId(profileId);
  }

  async findOne(id: number, profileId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne(id);
    
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    
    if (order.profileId !== profileId) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    
    return order;
  }

  async update(id: number, profileId: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Verificar se o pedido existe e pertence ao perfil
    await this.findOne(id, profileId);
    
    // Verificar se os produtos existem, se fornecidos
    let products = [];
    if (updateOrderDto.items && updateOrderDto.items.length > 0) {
      const productIds = updateOrderDto.items
        .filter(item => item.productId)
        .map(item => item.productId);
      
      if (productIds.length > 0) {
        products = await this.productsService.findByIds(productIds);
        
        if (products.length !== productIds.length) {
          throw new BadRequestException('Um ou mais produtos não foram encontrados');
        }
      }
    }
    
    // Verificar desconto, se fornecido
    if (updateOrderDto.discountId) {
      await this.discountsService.findOne(updateOrderDto.discountId);
    }
    
    // Buscar o pedido atual para recalcular o total, se necessário
    const currentOrder = await this.ordersRepository.findOne(id);
    let needsRecalculation = false;
    
    if (updateOrderDto.items || updateOrderDto.discountId !== undefined) {
      needsRecalculation = true;
    }
    
    let finalTotal = currentOrder.totalPrice;
    
    if (needsRecalculation) {
      // Se os itens foram atualizados, recalcular o total
      const items = updateOrderDto.items || currentOrder.items;
      const productIds = items.map(item => item.productId);
      const products = await this.productsService.findByIds(productIds);
      
      let total = 0;
      for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        total += product.price * item.quantity;
      }
      
      // Aplicar desconto, se houver
      const discountId = updateOrderDto.discountId !== undefined 
        ? updateOrderDto.discountId 
        : currentOrder.discountId;
      
      finalTotal = total;
      
      if (discountId) {
        const discount = await this.discountsService.findOne(discountId);
        if (discount.percentage) {
          finalTotal = total * (1 - discount.percentage / 100);
        } else if (discount.fixedAmount) {
          finalTotal = total - discount.fixedAmount;
        }
        
        // Garantir que o valor não seja negativo
        finalTotal = Math.max(0, finalTotal);
      }
    }
    
    // Atualizar o pedido
    await this.ordersRepository.update(id, {
      fullAddress: updateOrderDto.fullAddress,
      discountId: updateOrderDto.discountId,
      totalPrice: finalTotal,
    });
    
    // Se os itens foram atualizados, remover os antigos e adicionar os novos
    if (updateOrderDto.items && updateOrderDto.items.length > 0) {
      // Remover os itens antigos
      await this.ordersRepository.removeOrderItemsByOrderId(id);
      
      // Adicionar os novos itens
      for (const item of updateOrderDto.items) {
        const product = products.find(p => p.id === item.productId);
        await this.ordersRepository.createOrderItem({
          orderId: id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
          totalPrice: product.price * item.quantity,
        });
      }
    }
    
    // Retornar o pedido atualizado
    return this.ordersRepository.findOne(id);
  }

  async updateStatus(id: number, profileId: number, status: OrderStatus): Promise<Order> {
    // Verificar se o pedido existe e pertence ao perfil
    await this.findOne(id, profileId);
    
    return this.ordersRepository.updateStatus(id, status);
  }

  async remove(id: number, profileId: number): Promise<void> {
    // Verificar se o pedido existe e pertence ao perfil
    await this.findOne(id, profileId);
    
    await this.ordersRepository.remove(id);
  }
} 