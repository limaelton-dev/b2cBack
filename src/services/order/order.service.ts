import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from 'src/models/order/order';
import { OrderItem } from 'src/models/order_item/order_item';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { ProfileService } from '../profile/profile.service';
import { AddressService } from '../address/address.service';
import { ProdutoService } from '../produto/produto.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        private readonly profileService: ProfileService,
        private readonly addressService: AddressService,
        private readonly produtoService: ProdutoService,
        private readonly dataSource: DataSource,
    ) {}

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        // Verificar se o perfil existe
        await this.profileService.findById(createOrderDto.profile_id);
        
        // Verificar se o endereço existe e pertence ao perfil
        const address = await this.addressService.findOne(createOrderDto.address_id);
        if (address.profile_id !== createOrderDto.profile_id) {
            throw new BadRequestException('O endereço de entrega não pertence ao perfil informado');
        }
        
        // Calcular o valor total do pedido
        const totalAmount = createOrderDto.items.reduce(
            (sum, item) => sum + (item.quantity * item.unit_price),
            0
        );
        
        // Usar transação para garantir a integridade dos dados
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            // Criar o pedido
            const order = this.orderRepository.create({
                profile_id: createOrderDto.profile_id,
                address_id: createOrderDto.address_id,
                total_amount: totalAmount,
                status: 'PENDENTE', // Status inicial
            });
            
            const savedOrder = await queryRunner.manager.save(order);
            
            // Criar os itens do pedido
            const orderItems = [];
            
            for (const item of createOrderDto.items) {
                // Verificar se o produto existe
                const produto = await this.produtoService.findById(item.produto_id);
                
                const orderItem = this.orderItemRepository.create({
                    order_id: savedOrder.id,
                    produto_id: item.produto_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                });
                
                orderItems.push(orderItem);
            }
            
            await queryRunner.manager.save(orderItems);
            
            await queryRunner.commitTransaction();
            
            // Retornar o pedido com os itens
            return this.findOne(savedOrder.id);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(profileId: number): Promise<Order[]> {
        return this.orderRepository.find({
            where: { profile_id: profileId },
            relations: ['items', 'items.produto', 'address'],
            order: { created_at: 'DESC' }
        });
    }

    async findOne(id: number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['items', 'items.produto', 'address', 'profile']
        });
        
        if (!order) {
            throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
        }
        
        return order;
    }

    async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const order = await this.findOne(id);
        
        // Se o endereço de entrega for alterado, verificar se pertence ao perfil
        if (updateOrderDto.address_id) {
            const address = await this.addressService.findOne(updateOrderDto.address_id);
            if (address.profile_id !== order.profile_id) {
                throw new BadRequestException('O endereço de entrega não pertence ao perfil do pedido');
            }
        }
        
        Object.assign(order, updateOrderDto);
        
        return this.orderRepository.save(order);
    }

    async updateStatus(id: number, status: string): Promise<Order> {
        const order = await this.findOne(id);
        order.status = status;
        return this.orderRepository.save(order);
    }

    async remove(id: number): Promise<void> {
        const order = await this.findOne(id);
        await this.orderRepository.remove(order);
    }

    async getOrderDetails(id: number): Promise<any> {
        const order = await this.findOne(id);
        
        return {
            id: order.id,
            profile_id: order.profile_id,
            total_amount: order.total_amount,
            status: order.status,
            address: order.address,
            created_at: order.created_at,
            updated_at: order.updated_at,
            items: order.items.map(item => ({
                id: item.id,
                produto_id: item.produto_id,
                produto: item.produto,
                quantity: item.quantity,
                unit_price: item.unit_price,
            })),
        };
    }
} 