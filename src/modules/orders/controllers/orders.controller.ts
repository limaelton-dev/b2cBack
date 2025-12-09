import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { OrdersService } from '../services/orders.service';
import { OrdersSyncService } from '../services/orders-sync.service';

import { CheckoutDto } from '../dto/checkout.dto';
import { OrderSummaryDto } from '../dto/order-summary.dto';
import { OrderDetailDto } from '../dto/order-detail.dto';
import { OrdersFilters } from '../interfaces/orders-filters.interface';

// TODO: integrar com seu sistema de autenticação.
// Exemplo:
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
// import { GetUser } from '../../auth/decorators/get-user.decorator';
// import { UseGuards } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersSyncService: OrdersSyncService,
  ) {}

  @Post('checkout')
  // @UseGuards(JwtAuthGuard)
  async checkout(
    @Body() checkoutDto: CheckoutDto,
    // @GetUser('profileId') profileId: number,
  ): Promise<OrderDetailDto> {
    // TODO: usar profileId real da autenticação
    const profileId = 0;
    return this.ordersService.checkout(profileId, checkoutDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findOrdersForProfile(
    // @GetUser('profileId') profileId: number,
    @Query('status') status?: string,
    @Query('marketplace') marketplace?: string,
  ): Promise<OrderSummaryDto[]> {
    const profileId = 0;

    const filters: OrdersFilters = {
      status: status as any,
      marketplace: marketplace,
    };

    return this.ordersService.findOrdersForProfile(profileId, filters);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async findOrderDetailForProfile(
    @Param('id', ParseIntPipe) orderId: number,
    // @GetUser('profileId') profileId: number,
  ): Promise<OrderDetailDto> {
    const profileId = 0;
    return this.ordersService.findOrderDetailForProfile(profileId, orderId);
  }

  @Post('sync')
  async synchronizeOrdersFromAnymarketFeeds(): Promise<void> {
    // Endpoint administrativo para disparar a sincronização manualmente.
    await this.ordersSyncService.synchronizeOrdersFromAnymarketFeeds();
  }
}
