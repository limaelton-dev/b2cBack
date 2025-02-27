import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { OrderService } from 'src/services/order/order.service';
import { ProfileService } from 'src/services/profile/profile.service';
import { Order } from 'src/models/order/order';
import { CreateOrderDto } from 'src/services/order/dto/createOrder.dto';
import { UpdateOrderDto } from 'src/services/order/dto/updateOrder.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly profileService: ProfileService
    ) {}

    @Post()
    async create(@Request() req, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Associar o pedido ao perfil do usuário autenticado
        createOrderDto.profile_id = profile.id;
        
        return this.orderService.create(createOrderDto);
    }

    @Get()
    async findAll(@Request() req): Promise<Order[]> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        return this.orderService.findAll(profile.id);
    }

    @Get(':id')
    async findOne(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Order> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o pedido
        const order = await this.orderService.findOne(id);
        
        // Verificar se o pedido pertence ao usuário autenticado
        if (order.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para acessar este pedido');
        }
        
        return order;
    }

    @Get(':id/details')
    async getOrderDetails(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<any> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o pedido
        const order = await this.orderService.findOne(id);
        
        // Verificar se o pedido pertence ao usuário autenticado
        if (order.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para acessar os detalhes deste pedido');
        }
        
        return this.orderService.getOrderDetails(id);
    }

    @Patch(':id')
    async update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateOrderDto: UpdateOrderDto
    ): Promise<Order> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o pedido
        const order = await this.orderService.findOne(id);
        
        // Verificar se o pedido pertence ao usuário autenticado
        if (order.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para atualizar este pedido');
        }
        
        return this.orderService.update(id, updateOrderDto);
    }

    @Patch(':id/status/:status')
    async updateStatus(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Param('status') status: string
    ): Promise<Order> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o pedido
        const order = await this.orderService.findOne(id);
        
        // Verificar se o pedido pertence ao usuário autenticado
        if (order.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para atualizar o status deste pedido');
        }
        
        return this.orderService.updateStatus(id, status);
    }

    @Delete(':id')
    async remove(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<void> {
        // Obter o perfil do usuário autenticado
        const profile = await this.profileService.findByUserId(req.user.id);
        
        // Obter o pedido
        const order = await this.orderService.findOne(id);
        
        // Verificar se o pedido pertence ao usuário autenticado
        if (order.profile_id !== profile.id) {
            throw new ForbiddenException('Você não tem permissão para remover este pedido');
        }
        
        return this.orderService.remove(id);
    }
} 