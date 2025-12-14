import { Controller, Post, Body, Get, Param, Headers, UsePipes, ValidationPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { GuestCheckoutDto } from '../dto/guest-checkout.dto';
import { RegisteredCheckoutDto } from '../dto/registered-checkout.dto';
import { CreateOrderDto, OrderResult } from '../dto/create-order.dto';
import { ProcessPaymentDto, PaymentType, GatewayType } from '../dto/process-payment.dto';
import { CheckoutService, GuestCheckoutResult, RegisteredCheckoutResult } from '../services/checkout.service';
import { PaymentService } from '../services/payment.service';
import { PaymentGatewayResponse } from '../payment-gateway/interfaces/payment-gateway.interface';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('guest')
  @ApiOperation({ summary: 'Checkout para novos usuários (cria conta e retorna token)' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async processGuestCheckout(
    @Body() dto: GuestCheckoutDto,
  ): Promise<GuestCheckoutResult> {
    return this.checkoutService.processGuestCheckout(dto);
  }

  @Post('registered')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Checkout para usuários registrados (atualiza dados)' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async processRegisteredCheckout(
    @Body() dto: RegisteredCheckoutDto,
    @GetUser('profileId') profileId: number,
  ): Promise<RegisteredCheckoutResult> {
    return this.checkoutService.processRegisteredCheckout(dto, profileId);
  }

  @Post('order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria pedido a partir do carrinho' })
  @ApiHeader({ name: 'X-Idempotency-Key', required: false, description: 'UUID para idempotência' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createOrder(
    @Body() dto: CreateOrderDto,
    @GetUser('profileId') profileId: number,
    @Headers('x-idempotency-key') idempotencyKey?: string,
  ): Promise<OrderResult> {
    return this.checkoutService.createOrder(profileId, dto, idempotencyKey);
  }

  @Post('payment/:type/gateway/:gateway')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Processa pagamento com gateway específico' })
  @ApiParam({ name: 'type', enum: PaymentType, description: 'Tipo de pagamento' })
  @ApiParam({ name: 'gateway', enum: GatewayType, description: 'Gateway de pagamento' })
  @ApiHeader({ name: 'X-Idempotency-Key', required: true, description: 'UUID único por tentativa de pagamento' })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async processPayment(
    @Param('type') type: string, 
    @Param('gateway') gateway: string, 
    @Body() dto: ProcessPaymentDto,
    @GetUser('profileId') profileId: number,
    @Headers('x-idempotency-key') idempotencyKey: string,
  ): Promise<PaymentGatewayResponse> {
    if (!idempotencyKey) {
      throw new BadRequestException('Header X-Idempotency-Key é obrigatório');
    }

    const paymentType = this.parsePaymentType(type);
    const gatewayType = this.parseGatewayType(gateway);

    return this.paymentService.processPayment(paymentType, gatewayType, dto, profileId, idempotencyKey);
  }

  @Get('gateways')
  @ApiOperation({ summary: 'Lista os gateways de pagamento disponíveis' })
  async getAvailableGateways(): Promise<string[]> {
    return this.paymentService.getAvailableGateways();
  }

  @Get('gateways/info')
  @ApiOperation({ summary: 'Obtém informações detalhadas sobre os gateways' })
  async getGatewaysInfo(): Promise<Record<string, any>> {
    return this.paymentService.getGatewaysInfo();
  }

  private parsePaymentType(type: string): PaymentType {
    const validTypes: Record<string, PaymentType> = {
      'credit-card': PaymentType.CREDIT_CARD,
      'debit-card': PaymentType.DEBIT_CARD,
      'pix': PaymentType.PIX,
    };

    const paymentType = validTypes[type];
    if (!paymentType) {
      throw new BadRequestException(`Tipo de pagamento inválido: ${type}. Use: credit-card, debit-card ou pix`);
    }

    return paymentType;
  }

  private parseGatewayType(gateway: string): GatewayType {
    const validGateways: Record<string, GatewayType> = {
      'mercado-pago': GatewayType.MERCADO_PAGO,
      'cielo': GatewayType.CIELO,
    };

    const gatewayType = validGateways[gateway];
    if (!gatewayType) {
      throw new BadRequestException(`Gateway inválido: ${gateway}. Use: mercado-pago ou cielo`);
    }

    return gatewayType;
  }
}
