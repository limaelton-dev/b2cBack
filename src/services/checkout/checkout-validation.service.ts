import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from 'src/models/produto/produto';
import { Address } from 'src/models/address/address';
import { Card } from 'src/models/card/card';
import { Profile } from 'src/models/profile/profile';
import { CreateOrderDto } from '../order/dto/createOrder.dto';
import { CartDataDto } from '../cart/dto/updateCart.dto';
import { ProdutoService } from '../produto/produto.service';
import { AddressService } from '../address/address.service';
import { CardService } from '../card/card.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class CheckoutValidationService {
  private readonly logger = new Logger(CheckoutValidationService.name);

  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    private readonly produtoService: ProdutoService,
    private readonly addressService: AddressService,
    private readonly cardService: CardService,
    private readonly profileService: ProfileService,
  ) {}

  /**
   * Valida todos os aspectos do checkout antes de processar o pagamento
   * @param profileId ID do perfil do usuário
   * @param cartData Dados do carrinho
   * @param shippingAddressId ID do endereço de entrega
   * @param paymentMethod Método de pagamento
   * @param cardId ID do cartão (opcional, apenas para pagamentos com cartão)
   */
  async validateCheckout(
    profileId: number,
    cartData: CartDataDto,
    shippingAddressId: number,
    paymentMethod: string,
    cardId?: number,
  ): Promise<{ valid: boolean; orderDto?: CreateOrderDto; errors?: string[] }> {
    const errors = [];
    this.logger.log(`Iniciando validação de checkout para o perfil ${profileId}`);
    this.logger.log(`Dados do carrinho recebidos: ${JSON.stringify(cartData)}`);

    // Validar se o perfil existe
    try {
      await this.profileService.findById(profileId);
    } catch (error) {
      errors.push('Perfil não encontrado');
      return { valid: false, errors };
    }

    // Validar se o carrinho tem itens
    // Verificação mais robusta para diferentes formatos de dados do carrinho
    if (!cartData) {
      this.logger.error('Dados do carrinho são nulos');
      errors.push('O carrinho está vazio');
      return { valid: false, errors };
    }

    // Se cartData for um objeto com a propriedade cart_data
    let cartItems = [];
    if (cartData.cart_data) {
      this.logger.log(`Formato do carrinho: cartData.cart_data está presente`);
      cartItems = Array.isArray(cartData.cart_data) ? cartData.cart_data : [];
    } 
    // Se cartData for diretamente um array
    else if (Array.isArray(cartData)) {
      this.logger.log(`Formato do carrinho: cartData é um array`);
      cartItems = cartData;
    }
    // Se cartData for um objeto JSON serializado como string
    else if (typeof cartData === 'string') {
      try {
        this.logger.log(`Formato do carrinho: cartData é uma string, tentando parsear`);
        const parsedData = JSON.parse(cartData);
        cartItems = Array.isArray(parsedData) ? parsedData : 
                   (parsedData.cart_data && Array.isArray(parsedData.cart_data)) ? parsedData.cart_data : [];
      } catch (e) {
        this.logger.error(`Erro ao parsear string do carrinho: ${e.message}`);
      }
    }

    this.logger.log(`Itens do carrinho após processamento: ${JSON.stringify(cartItems)}`);

    if (cartItems.length === 0) {
      errors.push('O carrinho está vazio');
      return { valid: false, errors };
    }

    // Validar se o endereço de entrega existe e pertence ao perfil
    try {
      const address = await this.addressService.findOne(shippingAddressId);
      if (address.profile_id !== profileId) {
        errors.push('O endereço de entrega não pertence ao perfil informado');
        return { valid: false, errors };
      }
    } catch (error) {
      errors.push('Endereço de entrega não encontrado');
      return { valid: false, errors };
    }

    // Validar método de pagamento
    const validPaymentMethods = ['credit_card', 'debit_card', 'pix', 'boleto'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      errors.push('Método de pagamento inválido');
      return { valid: false, errors };
    }

    // Validar cartão se o método de pagamento for cartão de crédito ou débito
    if ((paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && cardId) {
      try {
        const card = await this.cardService.findOne(cardId);
        if (card.profile_id !== profileId) {
          errors.push('O cartão não pertence ao perfil informado');
          return { valid: false, errors };
        }
      } catch (error) {
        errors.push('Cartão não encontrado');
        return { valid: false, errors };
      }
    }

    // Validar disponibilidade dos produtos no carrinho
    try {
      // Extrair códigos de produto com tratamento para diferentes estruturas
      const productCodes = cartItems.map(item => {
        if (item.product && item.product.pro_codigo) {
          return item.product.pro_codigo;
        } else if (item.id) {
          return item.id; // Formato alternativo
        } else if (item.pro_codigo) {
          return item.pro_codigo; // Outro formato possível
        }
        return null;
      }).filter(code => code !== null);

      this.logger.log(`Códigos de produtos encontrados: ${productCodes.join(', ')}`);
      
      if (productCodes.length === 0) {
        errors.push('Não foi possível identificar os produtos no carrinho');
        return { valid: false, errors };
      }

      const productCodesStr = productCodes.join(',');
      
      const availableProducts = await this.produtoService.getProduto(productCodesStr);
      this.logger.log(`Produtos disponíveis encontrados: ${availableProducts.length}`);
      
      // Verificar se todos os produtos estão disponíveis
      if (availableProducts.length !== productCodes.length) {
        const availableCodes = availableProducts.map(p => p.pro_codigo);
        const missingCodes = productCodes.filter(code => !availableCodes.includes(code));
        
        errors.push(`Produtos não disponíveis: ${missingCodes.join(', ')}`);
        return { valid: false, errors };
      }
      
      // Verificar se os produtos estão ativos
      const inactiveProducts = availableProducts.filter(p => !p.pro_ativo);
      if (inactiveProducts.length > 0) {
        const inactiveCodes = inactiveProducts.map(p => p.pro_codigo);
        errors.push(`Produtos inativos: ${inactiveCodes.join(', ')}`);
        return { valid: false, errors };
      }
      
      // Criar DTO para o pedido com tratamento para diferentes estruturas
      const orderItems = cartItems.map(item => {
        let productCode, quantity, price;
        
        if (item.product && item.product.pro_codigo) {
          productCode = item.product.pro_codigo;
          quantity = item.quantity || 1;
          price = item.price || (item.product.price || 0);
        } else if (item.id || item.pro_codigo) {
          productCode = item.id || item.pro_codigo;
          quantity = item.quantity || 1;
          price = item.price || 0;
        }
        
        const product = availableProducts.find(p => p.pro_codigo === productCode);
        
        return {
          product_name: product.pro_descricao,
          quantity: quantity,
          unit_price: price || 0, // Usar o preço do item ou um valor padrão
        };
      });
      
      const orderDto: CreateOrderDto = {
        profile_id: profileId,
        shipping_address_id: shippingAddressId,
        payment_method: paymentMethod,
        items: orderItems,
      };
      
      this.logger.log(`Validação de checkout concluída com sucesso`);
      return { valid: true, orderDto };
    } catch (error) {
      this.logger.error(`Erro ao validar produtos: ${error.message}`, error.stack);
      errors.push('Erro ao validar produtos: ' + error.message);
      return { valid: false, errors };
    }
  }
  
  /**
   * Valida se um pedido pode ser processado pelo Mercado Pago
   * @param orderId ID do pedido
   * @param paymentMethod Método de pagamento
   * @param cardId ID do cartão (opcional)
   */
  async validateOrderForPayment(
    orderId: number,
    paymentMethod: string,
    cardId?: number,
  ): Promise<{ valid: boolean; errors?: string[] }> {
    const errors = [];
    
    // Validar método de pagamento
    const validPaymentMethods = ['credit_card', 'debit_card', 'pix', 'boleto'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      errors.push('Método de pagamento inválido');
      return { valid: false, errors };
    }
    
    // Validar cartão se o método de pagamento for cartão de crédito ou débito
    if ((paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && cardId) {
      try {
        await this.cardService.findOne(cardId);
      } catch (error) {
        errors.push('Cartão não encontrado');
        return { valid: false, errors };
      }
    }
    
    return { valid: true };
  }
} 