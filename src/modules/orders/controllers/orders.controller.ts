import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from '../services/orders.service';
import { OrdersSyncService } from '../services/orders-sync.service';

import { OrderSummaryDto } from '../dto/order-summary.dto';
import { OrderDetailDto } from '../dto/order-detail.dto';
import { OrdersFilters } from '../interfaces/orders-filters.interface';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ordersSyncService: OrdersSyncService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findOrdersForProfile(
    @GetUser('profileId') profileId: number,
    @Query('status') status?: string,
    //por que recebemos marketplace?
    @Query('marketplace') marketplace?: string,
  ): Promise<OrderSummaryDto[]> {
    const filters: OrdersFilters = {
      status: status as any,
      marketplace: marketplace,
    };

    return this.ordersService.findOrdersForProfile(profileId, filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOrderDetailForProfile(
    @Param('id', ParseIntPipe) orderId: number,
    @GetUser('profileId') profileId: number,
  ): Promise<OrderDetailDto> {
    return this.ordersService.findOrderDetailForProfile(profileId, orderId);
  }

  //deixar em standby por enquanto
  // @Post('sync')
  // @UseGuards(JwtAuthGuard)
  // async synchronizeOrdersFromAnymarketFeeds(): Promise<void> {
  //   await this.ordersSyncService.synchronizeOrdersFromAnymarketFeeds();
  // }
}
