import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { OrderService } from 'src/services/order/order.service';
import { Order } from 'src/models/order/order';
import { CreateOrderDto } from 'src/services/order/dto/createOrder.dto';
import { UpdateOrderDto } from 'src/services/order/dto/updateOrder.dto';

@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        return this.orderService.create(createOrderDto);
    }

    @Get('profile/:profileId')
    async findAll(@Param('profileId', ParseIntPipe) profileId: number): Promise<Order[]> {
        return this.orderService.findAll(profileId);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
        return this.orderService.findOne(id);
    }

    @Get(':id/details')
    async getOrderDetails(@Param('id', ParseIntPipe) id: number): Promise<any> {
        return this.orderService.getOrderDetails(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateOrderDto: UpdateOrderDto
    ): Promise<Order> {
        return this.orderService.update(id, updateOrderDto);
    }

    @Patch(':id/status/:status')
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Param('status') status: string
    ): Promise<Order> {
        return this.orderService.updateStatus(id, status);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.orderService.remove(id);
    }
} 