import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CheckoutService } from '../services/checkout.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Checkout')
@Controller('checkout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('validate')
  @ApiOperation({ summary: 'Valida o processo de checkout' })
  async validateCheckout(
    @GetUser('profileId') profileId: number,
    @Body('gatewayName') gatewayName: string,
  ) {
    console.log('CheckoutController.validateCheckout:', { 
      profileId, 
      gatewayName,
      typeProfileId: typeof profileId
    });
    
    return this.checkoutService.validateCheckout(profileId, gatewayName);
  }

  @Post('process')
  @ApiOperation({ summary: 'Processa o pagamento do checkout' })
  async processPayment(
    @GetUser('profileId') profileId: number,
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
      profileId,
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

  @Get('gateways/info')
  @ApiOperation({ summary: 'Obtém informações detalhadas sobre os gateways de pagamento disponíveis' })
  async getGatewaysInfo() {
    return this.checkoutService.getPaymentGatewaysInfo();
  }
} 