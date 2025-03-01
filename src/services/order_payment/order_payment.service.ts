import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderPayment, PaymentMethod } from 'src/models/order_payment/order_payment';
import { CreateOrderPaymentDto } from './dto/createOrderPayment.dto';
import { UpdateOrderPaymentDto } from './dto/updateOrderPayment.dto';
import { OrderService } from '../order/order.service';
import { CardService } from '../card/card.service';

@Injectable()
export class OrderPaymentService {
    constructor(
        @InjectRepository(OrderPayment)
        private readonly orderPaymentRepository: Repository<OrderPayment>,
        private readonly orderService: OrderService,
        private readonly cardService: CardService,
    ) {}

    async create(createOrderPaymentDto: CreateOrderPaymentDto): Promise<OrderPayment> {
        // Verificar se o pedido existe
        const order = await this.orderService.findOne(createOrderPaymentDto.order_id);
        
        // Verificar se já existe um pagamento para este pedido
        const existingPayment = await this.orderPaymentRepository.findOne({
            where: { order_id: createOrderPaymentDto.order_id }
        });
        
        if (existingPayment) {
            throw new BadRequestException('Já existe um pagamento para este pedido');
        }
        
        // Verificar se o cartão existe e pertence ao perfil do pedido, se for pagamento com cartão
        if (createOrderPaymentDto.payment_method === PaymentMethod.CARD && createOrderPaymentDto.card_id) {
            const card = await this.cardService.findOne(createOrderPaymentDto.card_id);
            if (card.profile_id !== order.profile_id) {
                throw new BadRequestException('O cartão não pertence ao perfil do pedido');
            }
        }
        
        // Criar o pagamento
        const orderPayment = this.orderPaymentRepository.create(createOrderPaymentDto);
        return this.orderPaymentRepository.save(orderPayment);
    }

    async findByOrderId(orderId: number): Promise<OrderPayment> {
        const orderPayment = await this.orderPaymentRepository.findOne({
            where: { order_id: orderId },
            relations: ['order', 'card']
        });
        
        if (!orderPayment) {
            throw new NotFoundException(`Pagamento para o pedido ${orderId} não encontrado`);
        }
        
        return orderPayment;
    }

    async findOne(id: number): Promise<OrderPayment> {
        const orderPayment = await this.orderPaymentRepository.findOne({
            where: { id },
            relations: ['order', 'card']
        });
        
        if (!orderPayment) {
            throw new NotFoundException(`Pagamento com ID ${id} não encontrado`);
        }
        
        return orderPayment;
    }

    async update(id: number, updateOrderPaymentDto: UpdateOrderPaymentDto): Promise<OrderPayment> {
        const orderPayment = await this.findOne(id);
        
        // Se o método de pagamento for alterado para cartão e um card_id for fornecido
        if (updateOrderPaymentDto.payment_method === PaymentMethod.CARD && updateOrderPaymentDto.card_id) {
            const order = await this.orderService.findOne(orderPayment.order_id);
            const card = await this.cardService.findOne(updateOrderPaymentDto.card_id);
            
            if (card.profile_id !== order.profile_id) {
                throw new BadRequestException('O cartão não pertence ao perfil do pedido');
            }
        }
        
        Object.assign(orderPayment, updateOrderPaymentDto);
        return this.orderPaymentRepository.save(orderPayment);
    }

    async updateStatus(id: number, status: string): Promise<OrderPayment> {
        const orderPayment = await this.findOne(id);
        orderPayment.status = status;
        return this.orderPaymentRepository.save(orderPayment);
    }

    async remove(id: number): Promise<void> {
        const orderPayment = await this.findOne(id);
        await this.orderPaymentRepository.remove(orderPayment);
    }
} 