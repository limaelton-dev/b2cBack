import { Controller, Post, Get, Body, Param, Query, ValidationPipe, ParseIntPipe, Logger } from '@nestjs/common';
import { ShippingService } from '../services/shipping.service';
import { CartShippingRequestDto } from '../dtos/cart-shipping-request.dto';
import { ShippingResponseDto } from '../dtos/shipping-response.dto';

@Controller('shipping')
export class ShippingController {
  private readonly logger = new Logger(ShippingController.name);

  constructor(private readonly shippingService: ShippingService) {}

  @Post('cart')
  async calculateForCart(
    @Body(ValidationPipe) request: CartShippingRequestDto,
  ): Promise<ShippingResponseDto> {
    this.logger.log(`POST /shipping/cart - ${request.items.length} itens`);
    return this.shippingService.calculateForCart(request.destinationZipCode, request.items);
  }

  @Get('product/:skuId')
  async calculateForProduct(
    @Param('skuId', ParseIntPipe) skuId: number,
    @Query('destinationZipCode') destinationZipCode: string,
    @Query('partnerId') partnerId?: string,
  ): Promise<ShippingResponseDto> {
    this.logger.log(`GET /shipping/product/${skuId}?destinationZipCode=${destinationZipCode}`);

    return this.shippingService.calculateForProduct(
      skuId,
      partnerId || String(skuId),
      destinationZipCode,
    );
  }
}
