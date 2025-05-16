import { Controller, Post, Body, Get, UseGuards, Param, Put, Query, Inject } from '@nestjs/common';
import { ICheckoutService } from '../interfaces/checkout-service.interface';
import { IPaymentService } from '../interfaces/payment-service.interface';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { PaymentMethod } from '../../../common/enums/payment-method.enum';
import { ProcessCreditCardDto, ProcessTokenizedCardDto } from '../dto/payment.dto';

@ApiTags('Checkout')
@Controller('checkout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckoutController {
  constructor(
    @Inject('CheckoutService') private readonly checkoutService: ICheckoutService,
    @Inject('CieloService') private readonly paymentService: IPaymentService
  ) {}

  @Post('validate')
  @ApiOperation({ summary: 'Valida o processo de checkout' })
  async validateCheckout(
    @GetUser('profileId') profileId: number,
    @Body('gatewayName') gatewayName?: string, // Cielo como padrão
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

  @Post('credit-card')
  @ApiOperation({ summary: 'Processa pagamento com cartão de crédito via Cielo' })
  @ApiBody({ type: ProcessCreditCardDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Pagamento processado com sucesso',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        transactionId: { type: 'string', example: '12345678901234567890' },
        status: { type: 'string', example: 'PaymentConfirmed' },
        code: { type: 'string', example: '4' },
        message: { type: 'string', example: 'Operation Successful' },
        order: { type: 'object', example: { id: 1, status: 'PENDING' } }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou incompletos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async processCreditCardPayment(
    @GetUser('profileId') profileId: number,
    @GetUser('email') userEmail: string,
    @GetUser('name') userName: string,
    @Body() paymentDto: ProcessCreditCardDto
  ) {
    // Primeiro validamos o checkout para obter os totais do carrinho
    const checkoutValidation = await this.checkoutService.validateCheckout(profileId);
    
    if (!checkoutValidation.success || !checkoutValidation.data?.totals?.total) {
      return {
        success: false,
        message: 'Não foi possível calcular o valor total do pedido',
        details: checkoutValidation
      };
    }
    
    // Obter o valor total do pedido a partir da validação do checkout
    const amount = checkoutValidation.data.totals.total;
    
    // Obter informações do usuário da decoração JWT ou do DTO
    const customer = {
      name: paymentDto.customerData?.name || userName,
      email: paymentDto.customerData?.email || userEmail,
    };

    // Processar pagamento com cartão de crédito via Cielo
    const creditCardResponse = await this.paymentService.processCreditCardPayment(
      amount,
      {
        cardNumber: paymentDto.cardNumber,
        holder: paymentDto.holder,
        expirationDate: paymentDto.expirationDate,
        securityCode: paymentDto.securityCode,
        brand: paymentDto.brand,
      },
      customer,
      paymentDto.description || 'Compra online Coletek'
    );

    // Se o pagamento for bem-sucedido, criar a ordem
    if (creditCardResponse.success && creditCardResponse.transactionId) {
      const orderResult = await this.checkoutService.processPayment(
        profileId,
        PaymentMethod.CREDIT_CARD,
        { 
          ...customer, 
          id: profileId,
          // Incluir dados do cartão para o processamento do pedido
          cardData: {
            cardNumber: paymentDto.cardNumber,
            holder: paymentDto.holder,
            expirationDate: paymentDto.expirationDate,
            securityCode: paymentDto.securityCode,
            brand: paymentDto.brand
          }
        },
        paymentDto.address
      );
      
      return {
        ...creditCardResponse,
        order: orderResult
      };
    }

    return creditCardResponse;
  }

  @Post('credit-card/token')
  @ApiOperation({ summary: 'Processa pagamento com cartão tokenizado via Cielo' })
  @ApiBody({ type: ProcessTokenizedCardDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Pagamento com token processado com sucesso',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        transactionId: { type: 'string', example: '12345678901234567890' },
        status: { type: 'string', example: 'PaymentConfirmed' },
        code: { type: 'string', example: '4' },
        message: { type: 'string', example: 'Operation Successful' },
        order: { type: 'object', example: { id: 1, status: 'PENDING' } }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou incompletos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async processTokenizedCardPayment(
    @GetUser('profileId') profileId: number,
    @GetUser('email') userEmail: string,
    @GetUser('name') userName: string,
    @Body() paymentDto: ProcessTokenizedCardDto
  ) {
    // Primeiro validamos o checkout para obter os totais do carrinho
    const checkoutValidation = await this.checkoutService.validateCheckout(profileId);
    
    if (!checkoutValidation.success || !checkoutValidation.data?.totals?.total) {
      return {
        success: false,
        message: 'Não foi possível calcular o valor total do pedido',
        details: checkoutValidation
      };
    }
    
    // Obter o valor total do pedido a partir da validação do checkout
    const amount = checkoutValidation.data.totals.total;
    
    // Obter informações do usuário da decoração JWT ou do DTO
    const customer = {
      name: paymentDto.customerData?.name || userName,
      email: paymentDto.customerData?.email || userEmail,
    };

    // Processar pagamento com cartão tokenizado via Cielo
    const tokenizedResponse = await this.paymentService.processTokenizedCardPayment(
      amount,
      {
        token: paymentDto.token,
        brand: paymentDto.brand,
      },
      customer,
      paymentDto.description || 'Compra online (token)'
    );

    // Se o pagamento for bem-sucedido, criar a ordem
    if (tokenizedResponse.success && tokenizedResponse.transactionId) {
      const orderResult = await this.checkoutService.processPayment(
        profileId,
        PaymentMethod.CREDIT_CARD,
        { 
          ...customer, 
          id: profileId,
          // Incluir dados do cartão tokenizado para o processamento do pedido
          cardData: {
            token: paymentDto.token,
            brand: paymentDto.brand
          }
        },
        paymentDto.address
      );
      
      return {
        ...tokenizedResponse,
        order: orderResult
      };
    }

    return tokenizedResponse;
  }

  @Get('transaction/:paymentId')
  @ApiOperation({ summary: 'Consulta uma transação na Cielo pelo ID' })
  @ApiParam({ name: 'paymentId', description: 'ID da transação na Cielo' })
  async consultTransaction(@Param('paymentId') paymentId: string) {
    return this.paymentService.consultTransaction(paymentId);
  }

  @Put('transaction/:paymentId/capture')
  @ApiOperation({ summary: 'Captura uma transação na Cielo' })
  @ApiParam({ name: 'paymentId', description: 'ID da transação na Cielo' })
  async captureTransaction(
    @Param('paymentId') paymentId: string,
    @Query('amount') amount?: number,
  ) {
    return this.paymentService.captureTransaction(paymentId, amount);
  }

  @Put('transaction/:paymentId/cancel')
  @ApiOperation({ summary: 'Cancela uma transação na Cielo' })
  @ApiParam({ name: 'paymentId', description: 'ID da transação na Cielo' })
  async cancelTransaction(
    @Param('paymentId') paymentId: string,
    @Query('amount') amount?: number,
  ) {
    return this.paymentService.cancelTransaction(paymentId, amount);
  }

  @Get('test-cards')
  @ApiOperation({ summary: 'Retorna os cartões de teste disponíveis para ambiente sandbox' })
  getTestCards() {
    return this.paymentService.getTestCards();
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