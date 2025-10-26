import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AnyMarketOrderFilter } from '../dto/anymarket-order.dto';

@Controller('order')
// @UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('anymarket/orders')
  async getOrdersFromAnyMarket(
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
    @Query('marketplaceId') marketplaceId?: string,
    @Query('accountName') accountName?: string,
    @Query('orderId') orderId?: string,
    @Query('orderNumber') orderNumber?: string,
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('trackingNumber') trackingNumber?: string,
    @Query('createdAfter') createdAfter?: string,
    @Query('createdBefore') createdBefore?: string,
    @Query('updatedAfter') updatedAfter?: string,
    @Query('updatedBefore') updatedBefore?: string,
  ) {
    const filters: AnyMarketOrderFilter = {};

    if (offset !== undefined && offset !== null && offset !== '' && offset !== 'null') {
      const offsetNum = parseInt(offset, 10);
      if (!isNaN(offsetNum)) {
        filters.offset = offsetNum;
      }
    }
    
    if (limit !== undefined && limit !== null && limit !== '' && limit !== 'null') {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum)) {
        filters.limit = limitNum;
      }
    }

    if (marketplaceId && marketplaceId !== 'null') filters.marketplaceId = marketplaceId;
    if (accountName && accountName !== 'null') filters.accountName = accountName;
    if (orderId && orderId !== 'null') filters.orderId = orderId;
    if (orderNumber && orderNumber !== 'null') filters.orderNumber = orderNumber;
    if (status && status !== 'null') filters.status = status;
    if (paymentStatus && paymentStatus !== 'null') filters.paymentStatus = paymentStatus;
    if (trackingNumber && trackingNumber !== 'null') filters.trackingNumber = trackingNumber;
    if (createdAfter && createdAfter !== 'null') filters.createdAfter = createdAfter;
    if (createdBefore && createdBefore !== 'null') filters.createdBefore = createdBefore;
    if (updatedAfter && updatedAfter !== 'null') filters.updatedAfter = updatedAfter;
    if (updatedBefore && updatedBefore !== 'null') filters.updatedBefore = updatedBefore;

    return this.ordersService.getOrdersFromAnyMarket(filters);
  }

  @Get('anymarket/orders/:orderId')
  async getOrderByIdFromAnyMarket(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderByIdFromAnyMarket(orderId);
  }
} 