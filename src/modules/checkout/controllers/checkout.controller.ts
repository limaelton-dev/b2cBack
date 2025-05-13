import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CheckoutService } from '../services/checkout.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Checkout')
@Controller('checkout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('initialize/:cartId')
  @ApiOperation({ summary: 'Inicializa o processo de checkout' })
  async initializeCheckout(
    @Param('cartId') cartId: number,
    @Body('gatewayName') gatewayName: string,
  ) {
    return this.checkoutService.initializeCheckout(cartId, gatewayName);
  }

  @Post('process/:cartId')
  @ApiOperation({ summary: 'Processa o pagamento do checkout' })
  async processPayment(
    @Param('cartId') cartId: number,
    @Body() paymentData: {
      paymentMethod: string;
      customerData: {
        id: number;
        email: string;
        name: string;
      };
      address: string;
    },
  ) {
    return this.checkoutService.processPayment(
      cartId,
      paymentData.paymentMethod,
      paymentData.customerData,
      paymentData.address,
    );
  }

  @Get('gateways')
  @ApiOperation({ summary: 'Lista os gateways de pagamento disponíveis' })
  async getAvailableGateways() {
    return this.checkoutService.getAvailablePaymentGateways();
  }
} 