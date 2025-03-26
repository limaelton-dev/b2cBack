import { Controller, Post, Body, Param, Get, Put, Delete, UseGuards, Request, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { OrderStatus } from '../../../common/enums/order-status.enum';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(req.user.profileId, createOrderDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.orderService.findAll(req.user.profileId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.orderService.findOne(+id, req.user.profileId);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(+id, req.user.profileId, updateOrderDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateStatus(+id, req.user.profileId, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('id') id: string) {
    return this.orderService.remove(+id, req.user.profileId);
  }
} 