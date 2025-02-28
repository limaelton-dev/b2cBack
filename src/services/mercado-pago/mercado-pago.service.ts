import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Payment, Preference, MerchantOrder } from 'mercadopago';
import { PaymentDTO } from './dto/payment.dto';
import { PreferenceDTO } from './dto/preference.dto';
import { WebhookDTO } from './dto/webhook.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private payment: Payment;
  private preference: Preference;
  private merchantOrder: MerchantOrder;
  private readonly logger = new Logger(MercadoPagoService.name);

  constructor(private readonly configService: ConfigService) {
    // Configuração do SDK do Mercado Pago
    const accessToken = this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN');
    
    if (!accessToken) {
      this.logger.warn('MERCADO_PAGO_ACCESS_TOKEN não configurado. A integração com o Mercado Pago não funcionará corretamente.');
    }
    
    this.client = new MercadoPagoConfig({ 
      accessToken: accessToken || 'TEST-DUMMY-ACCESS-TOKEN',
      options: { timeout: 5000 }
    });
    
    // Inicialização dos objetos de API
    this.payment = new Payment(this.client);
    this.preference = new Preference(this.client);
    this.merchantOrder = new MerchantOrder(this.client);
  }

  /**
   * Cria um pagamento usando o Checkout Transparente do Mercado Pago
   * @param paymentData Dados do pagamento
   * @returns Resposta da API do Mercado Pago
   */
  async createPayment(paymentData: PaymentDTO): Promise<any> {
    try {
      this.logger.log(`Criando pagamento: ${JSON.stringify(paymentData)}`);
      
      // Garantir que installments seja um número
      const paymentDataWithNumericInstallments = {
        ...paymentData,
        installments: Number(paymentData.installments)
      };
      
      // Log dos dados que serão enviados para a API
      this.logger.log(`Dados formatados para envio: ${JSON.stringify(paymentDataWithNumericInstallments)}`);
      
      const response = await this.payment.create({ body: paymentDataWithNumericInstallments });
      this.logger.log(`Pagamento criado com sucesso: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      this.logger.error(`Erro ao processar pagamento: ${error.message}`, error.stack);
      
      // Log detalhado do erro
      if (error.cause) {
        this.logger.error(`Detalhes do erro: ${JSON.stringify(error.cause)}`);
        
        // Extrair informações mais detalhadas do erro
        if (Array.isArray(error.cause) && error.cause.length > 0) {
          const errorDetails = error.cause.map(e => `${e.code}: ${e.description}`).join(', ');
          throw new BadRequestException(`Erro ao processar pagamento: ${errorDetails}`);
        }
      }
      
      throw new BadRequestException(`Erro ao processar pagamento: ${error.message}`);
    }
  }

  /**
   * Cria uma preferência de pagamento (usado para checkout redirect)
   * @param preferenceData Dados da preferência
   * @returns Resposta da API do Mercado Pago
   */
  async createPreference(preferenceData: PreferenceDTO): Promise<any> {
    try {
      this.logger.log(`Criando preferência: ${JSON.stringify(preferenceData)}`);
      
      // Garantir que cada item tenha um ID único se não for fornecido
      const itemsWithIds = preferenceData.items.map(item => {
        if (!item.id) {
          return {
            ...item,
            id: uuidv4()
          };
        }
        return item;
      });
      
      // Criar uma cópia do objeto com os itens atualizados
      const preferenceWithIds = {
        ...preferenceData,
        items: itemsWithIds
      };
      
      const response = await this.preference.create({ body: preferenceWithIds });
      this.logger.log(`Preferência criada com sucesso: ${JSON.stringify(response.id)}`);
      return response;
    } catch (error) {
      this.logger.error(`Erro ao criar preferência: ${error.message}`, error.stack);
      if (error.cause) {
        this.logger.error(`Detalhes do erro: ${JSON.stringify(error.cause)}`);
      }
      throw new BadRequestException(`Erro ao criar preferência: ${error.message}`);
    }
  }

  /**
   * Obtém informações de um pagamento
   * @param paymentId ID do pagamento
   * @returns Informações do pagamento
   */
  async getPayment(paymentId: number): Promise<any> {
    try {
      this.logger.log(`Obtendo informações do pagamento: ${paymentId}`);
      const response = await this.payment.get({ id: paymentId });
      return response;
    } catch (error) {
      this.logger.error(`Erro ao obter informações do pagamento: ${error.message}`, error.stack);
      throw new BadRequestException(`Erro ao obter informações do pagamento: ${error.message}`);
    }
  }

  /**
   * Obtém informações de um merchant order
   * @param merchantOrderId ID do merchant order
   * @returns Informações do merchant order
   */
  async getMerchantOrder(merchantOrderId: number): Promise<any> {
    try {
      this.logger.log(`Obtendo informações do merchant order: ${merchantOrderId}`);
      const response = await this.merchantOrder.get({ merchantOrderId });
      return response;
    } catch (error) {
      this.logger.error(`Erro ao obter informações do merchant order: ${error.message}`, error.stack);
      throw new BadRequestException(`Erro ao obter informações do merchant order: ${error.message}`);
    }
  }

  /**
   * Processa um webhook do Mercado Pago
   * @param data Dados do webhook
   * @returns Resultado do processamento
   */
  async processWebhook(data: WebhookDTO): Promise<any> {
    try {
      this.logger.log(`Processando webhook: ${JSON.stringify(data)}`);
      
      // Implementar lógica para processar notificações do Mercado Pago
      if (data.type === 'payment') {
        const paymentId = Number(data.data.id);
        // Obter detalhes do pagamento
        const paymentInfo = await this.getPayment(paymentId);
        this.logger.log(`Webhook de pagamento processado: ${JSON.stringify(paymentInfo.status)}`);
        return {
          success: true,
          payment: paymentInfo
        };
      } else if (data.type === 'merchant_order') {
        const merchantOrderId = Number(data.data.id);
        // Obter detalhes do merchant order
        const merchantOrderInfo = await this.getMerchantOrder(merchantOrderId);
        this.logger.log(`Webhook de merchant order processado: ${JSON.stringify(merchantOrderInfo.id)}`);
        return {
          success: true,
          merchantOrder: merchantOrderInfo
        };
      }
      
      this.logger.warn(`Tipo de notificação não suportado: ${data.type}`);
      return {
        success: false,
        message: 'Tipo de notificação não suportado'
      };
    } catch (error) {
      this.logger.error(`Erro ao processar webhook: ${error.message}`, error.stack);
      throw new BadRequestException(`Erro ao processar webhook: ${error.message}`);
    }
  }
} 