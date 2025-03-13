import { Controller, Post, Body, UseGuards, Request, BadRequestException, HttpStatus, Res, Logger, ValidationPipe, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckoutValidationService } from 'src/services/checkout/checkout-validation.service';
import { CartService } from 'src/services/cart/cart.service';
import { OrderService } from 'src/services/order/order.service';
import { OrderPaymentService } from 'src/services/order_payment/order_payment.service';
import { ProfileService } from 'src/services/profile/profile.service';
import { MercadoPagoService } from 'src/services/mercado-pago/mercado-pago.service';
import { CheckoutDto } from './dto/checkout.dto';
import { PaymentProcessDTO } from './dto/payment-process.dto';
import { PaymentMethod } from 'src/models/order_payment/order_payment';
import { CpfDto } from './dto/cpf.dto';
import { EmailDto } from './dto/email.dto';

@Controller('checkout')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
  private readonly logger = new Logger(CheckoutController.name);

  constructor(
    private readonly checkoutValidationService: CheckoutValidationService,
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly orderPaymentService: OrderPaymentService,
    private readonly profileService: ProfileService,
    private readonly mercadoPagoService: MercadoPagoService,
  ) {}

  /**
   * Endpoint para validar e iniciar o processo de checkout
   */
  @Post('validate')
  @UsePipes(new ValidationPipe({ transform: true }))
  async validateCheckout(@Request() req, @Body() checkoutDto: CheckoutDto, @Res() res: Response) {
    try {
      this.logger.log(`Iniciando validação de checkout: ${JSON.stringify(checkoutDto)}`);
      this.logger.log(`Usuário autenticado: ${JSON.stringify(req.user)}`);
      
      // Obter o perfil do usuário autenticado
      const profile = await this.profileService.findByUserId(req.user.id);
      
      // Obter o carrinho do usuário
      const cartData = await this.cartService.getUserCart(req.user.id);
      
      // Validar o checkout
      const validationResult = await this.checkoutValidationService.validateCheckout(
        profile.id,
        cartData,
        checkoutDto.address_id,
        checkoutDto.payment_method,
        checkoutDto.card_id,
      );
      
      if (!validationResult.valid) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          errors: validationResult.errors,
        });
      }
      
      // Criar o pedido
      const order = await this.orderService.create(validationResult.orderDto);
      
      // Retornar o resultado da validação
      return res.status(HttpStatus.OK).json({
        success: true,
        order_id: order.id,
        message: 'Checkout validado com sucesso',
      });
    } catch (error) {
      this.logger.error(`Erro ao validar checkout: ${error.message}`, error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message,
      });
    }
  }

  
  @UseGuards(JwtAuthGuard)
  @Post('validacpf')
  async validaCpf(@Body() cpfDto: CpfDto, @Res() res: Response): Promise<void> {
    const cpf = cpfDto.cpf;
    const validationResult = await this.checkoutValidationService.validaCpf(cpf);
    res.status(validationResult.status).json({
      success: validationResult.success,
      status: validationResult.status,
      message: validationResult.message,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('validaEmail')
  async validaEmail(@Body() emailDto: EmailDto, @Res() res: Response): Promise<void> {
    const email = emailDto.email;
    const validationResult = await this.checkoutValidationService.validaEmail(email);
    res.status(validationResult.status).json({
      success: validationResult.success,
      status: validationResult.status,
      message: validationResult.message,
    });
  }

  /**
   * Endpoint para processar o pagamento após a validação do checkout
   */
  @Post('process-payment')
  @UsePipes(new ValidationPipe({ transform: true }))
  async processPayment(@Request() req, @Body() paymentData: PaymentProcessDTO, @Res() res: Response) {
    try {
      this.logger.log(`Processando pagamento: ${JSON.stringify(paymentData)}`);
      
      // Obter o perfil do usuário autenticado
      const profile = await this.profileService.findByUserId(req.user.id);
      
      // Validar se o pedido existe e pertence ao usuário
      const order = await this.orderService.findOne(paymentData.order_id);
      if (order.profile_id !== profile.id) {
        throw new BadRequestException('O pedido não pertence ao usuário autenticado');
      }
      
      // Validar o pedido para pagamento
      const validationResult = await this.checkoutValidationService.validateOrderForPayment(
        paymentData.order_id,
        paymentData.payment_method,
        paymentData.card_id,
      );
      
      if (!validationResult.valid) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          errors: validationResult.errors,
        });
      }
      
      // Preparar os dados para o Mercado Pago
      const paymentRequest = {
        transaction_amount: order.total_amount,
        description: `Pedido #${order.id}`,
        payment_method_id: paymentData.payment_method_id,
        token: paymentData.token,
        installments: paymentData.installments || 1,
        external_reference: order.id.toString(),
        payer: {
          email: req.user.email,
          identification: paymentData.payer?.identification,
          // Usar o nome completo do perfil PF ou o nome do usuário
          first_name: profile.profilePF?.full_name ? profile.profilePF.full_name.split(' ')[0] : req.user.name,
          last_name: profile.profilePF?.full_name ? profile.profilePF.full_name.split(' ').slice(1).join(' ') : req.user.lastname,
        }
      };
      
      // Processar o pagamento com o Mercado Pago
      const paymentResponse = await this.mercadoPagoService.createPayment(paymentRequest);
      
      // Atualizar o status do pedido
      const status = this.mapPaymentStatus(paymentResponse.status);
      await this.orderService.updateStatus(order.id, status);
      
      // Criar o registro de pagamento
      const orderPayment = await this.orderPaymentService.create({
        order_id: order.id,
        payment_method: paymentData.payment_method,
        card_id: paymentData.payment_method === PaymentMethod.CARD ? paymentData.card_id : null,
        amount: order.total_amount,
        status: paymentResponse.status,
        // Campos específicos para cada método de pagamento
        ...(paymentData.payment_method === PaymentMethod.PIX && {
          pix_txid: paymentResponse.id,
          pix_qrcode: paymentResponse.point_of_interaction?.transaction_data?.qr_code,
        }),
        ...(paymentData.payment_method === PaymentMethod.BOLETO && {
          boleto_code: paymentResponse.barcode?.content,
          boleto_url: paymentResponse.transaction_details?.external_resource_url,
        }),
      });
      
      // Limpar o carrinho se o pagamento for aprovado
      if (paymentResponse.status === 'approved') {
        await this.cartService.updateUserCart(req.user.id, { cart_data: [] });
      }
      
      // Retornar a resposta do pagamento
      return res.status(HttpStatus.OK).json({
        success: true,
        payment: {
          id: paymentResponse.id,
          status: paymentResponse.status,
          status_detail: paymentResponse.status_detail,
          payment_method_id: paymentResponse.payment_method_id,
          payment_type_id: paymentResponse.payment_type_id,
          transaction_amount: paymentResponse.transaction_amount,
          installments: paymentResponse.installments,
          date_approved: paymentResponse.date_approved,
          date_created: paymentResponse.date_created,
        },
        order_status: status,
        message: this.getUserFriendlyMessage(paymentResponse.status, paymentResponse.status_detail),
        is_approved: paymentResponse.status === 'approved'
      });
    } catch (error) {
      this.logger.error(`Erro ao processar pagamento: ${error.message}`, error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Mapeia o status do pagamento do Mercado Pago para o status do pedido no sistema
   */
  private mapPaymentStatus(mpStatus: string): string {
    const statusMap = {
      'approved': 'APROVADO',
      'pending': 'PENDENTE',
      'in_process': 'EM_PROCESSAMENTO',
      'rejected': 'REJEITADO',
      'refunded': 'REEMBOLSADO',
      'cancelled': 'CANCELADO',
      'in_mediation': 'EM_DISPUTA',
      'charged_back': 'ESTORNADO'
    };
    
    return statusMap[mpStatus] || 'PENDENTE';
  }

  /**
   * Retorna uma mensagem amigável para o usuário com base no status e status_detail do pagamento
   */
  private getUserFriendlyMessage(status: string, statusDetail: string): string {
    if (status === 'approved') {
      return 'Pagamento aprovado com sucesso! Obrigado pela sua compra.';
    }
    
    const statusDetailMessages = {
      // Mensagens para status rejected
      'cc_rejected_bad_filled_date': 'A data do cartão está incorreta. Por favor, verifique e tente novamente.',
      'cc_rejected_bad_filled_other': 'Algum dado do cartão está incorreto. Por favor, verifique e tente novamente.',
      'cc_rejected_bad_filled_security_code': 'O código de segurança está incorreto. Por favor, verifique e tente novamente.',
      'cc_rejected_blacklist': 'Não foi possível processar seu pagamento. Por favor, use outro cartão ou entre em contato com o emissor.',
      'cc_rejected_call_for_authorize': 'Seu banco requer autorização para este pagamento. Por favor, ligue para o número no verso do seu cartão.',
      'cc_rejected_card_disabled': 'Seu cartão está desativado. Por favor, entre em contato com o emissor para ativá-lo ou use outro cartão.',
      'cc_rejected_duplicated_payment': 'Você já realizou um pagamento com este valor. Se precisar pagar novamente, use outro cartão ou outra forma de pagamento.',
      'cc_rejected_high_risk': 'Seu pagamento foi recusado por motivos de segurança. Por favor, use outro cartão ou entre em contato com o emissor.',
      'cc_rejected_insufficient_amount': 'Seu cartão não possui saldo suficiente. Por favor, use outro cartão ou entre em contato com o emissor.',
      'cc_rejected_invalid_installments': 'Seu cartão não aceita o número de parcelas selecionado. Por favor, escolha outro número de parcelas ou use outro cartão.',
      'cc_rejected_max_attempts': 'Você atingiu o limite de tentativas permitidas. Por favor, use outro cartão ou tente novamente mais tarde.',
      'cc_rejected_other_reason': 'O emissor do cartão recusou o pagamento. Por favor, use outro cartão ou entre em contato com o emissor para mais informações.',
      
      // Mensagens para status pending
      'pending_contingency': 'Estamos processando seu pagamento. Em até 2 dias úteis informaremos por e-mail o resultado.',
      'pending_review_manual': 'Estamos analisando seu pagamento. Em até 2 dias úteis informaremos por e-mail se foi aprovado ou se precisamos de mais informações.',
      
      // Mensagens para status in_process
      'in_process': 'Estamos processando seu pagamento. Em breve você receberá uma atualização.',
      
      // Mensagens para outros status
      'rejected': 'Seu pagamento foi rejeitado. Por favor, tente novamente com outro método de pagamento.',
      'cancelled': 'O pagamento foi cancelado.',
      'refunded': 'O pagamento foi reembolsado.',
      'charged_back': 'O pagamento foi estornado pelo emissor do cartão.'
    };
    
    return statusDetailMessages[statusDetail] || 
           statusDetailMessages[status] || 
           'Ocorreu um problema com seu pagamento. Por favor, tente novamente ou entre em contato com o suporte.';
  }
} 