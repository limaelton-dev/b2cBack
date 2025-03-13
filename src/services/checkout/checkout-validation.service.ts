import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from 'src/models/produto/produto';
import { Address } from 'src/models/address/address';
import { Card } from 'src/models/card/card';
import { Profile } from 'src/models/profile/profile';
import { PaymentMethod } from 'src/models/order_payment/order_payment';
import { CreateOrderDto } from '../order/dto/createOrder.dto';
import { CartDataDto } from '../cart/dto/updateCart.dto';
import { ProdutoService } from '../produto/produto.service';
import { AddressService } from '../address/address.service';
import { CardService } from '../card/card.service';
import { ProfileService } from '../profile/profile.service';
import { ProfilePFService } from '../profile_pf/profile_pf.service';
import { ProfilePF } from '../../models/profile_pf/profile_pf';
import { User } from 'src/models/user/user';

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
    @InjectRepository(ProfilePF)
    private readonly profilePFService: Repository<ProfilePF>,
    @InjectRepository(User)
    private readonly userService: Repository<User>
  ) {}

  /**
   * Valida todos os aspectos do checkout antes de processar o pagamento
   * @param profileId ID do perfil do usuário
   * @param cartData Dados do carrinho
   * @param addressId ID do endereço de entrega
   * @param paymentMethod Método de pagamento
   * @param cardId ID do cartão (opcional, apenas para pagamentos com cartão)
   */
  async validateCheckout(
    profileId: number,
    cartData: CartDataDto,
    addressId: number,
    paymentMethod: PaymentMethod,
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
    // try {
    //   const address = await this.addressService.findOne(addressId);
    //   if (address.profile_id !== profileId) {
    //     errors.push('O endereço de entrega não pertence ao perfil informado');
    //     return { valid: false, errors };
    //   }
    // } catch (error) {
    //   errors.push('Endereço de entrega não encontrado');
    //   return { valid: false, errors };
    // }

    // Validar método de pagamento
    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
      errors.push('Método de pagamento inválido');
      return { valid: false, errors };
    }

    // Validar cartão se o método de pagamento for cartão
    // if (paymentMethod === PaymentMethod.CARD && cardId) {
    //   try {
    //     const card = await this.cardService.findOne(cardId);
    //     if (card.profile_id !== profileId) {
    //       errors.push('O cartão não pertence ao perfil informado');
    //       return { valid: false, errors };
    //     }
    //   } catch (error) {
    //     errors.push('Cartão não encontrado');
    //     return { valid: false, errors };
    //   }
    // }

    // Validar disponibilidade dos produtos no carrinho
    try {
      // Extrair IDs de produto com tratamento para diferentes estruturas
      const productIds = cartItems.map(item => {
        if (item.produto_id) {
          return item.produto_id;
        } else if (item.product && item.product.id) {
          return item.product.id;
        } else if (item.id) {
          return item.id;
        }
        return null;
      }).filter(id => id !== null);

      this.logger.log(`IDs de produtos encontrados: ${productIds.join(', ')}`);
      
      if (productIds.length === 0) {
        errors.push('Não foi possível identificar os produtos no carrinho');
        return { valid: false, errors };
      }

      const productIdsStr = productIds.join(',');
      
      const availableProducts = await this.produtoService.getProduto(productIdsStr);
      this.logger.log(`Produtos disponíveis encontrados: ${availableProducts.length}`);
      
      // Verificar se todos os produtos estão disponíveis
      if (availableProducts.length !== productIds.length) {
        const availableIds = availableProducts.map(p => p.id);
        this.logger.log(`IDs de produtos disponíveis: ${JSON.stringify(availableIds)}`);
        this.logger.log(`IDs de produtos no carrinho: ${JSON.stringify(productIds)}`);
        
        // Converter todos os IDs para números para garantir comparação correta
        const availableIdsNumbers = availableIds.map(id => Number(id));
        const productIdsNumbers = productIds.map(id => Number(id));
        
        const missingIds = productIdsNumbers.filter(id => !availableIdsNumbers.includes(id));
        
        errors.push(`Produtos não disponíveis: ${missingIds.join(', ')}`);
        return { valid: false, errors };
      }
      
      // Verificar se os produtos estão ativos
      const inactiveProducts = availableProducts.filter(p => !p.pro_ativo);
      if (inactiveProducts.length > 0) {
        const inactiveIds = inactiveProducts.map(p => p.id);
        errors.push(`Produtos inativos: ${inactiveIds.join(', ')}`);
        return { valid: false, errors };
      }
      
      // Criar DTO para o pedido com tratamento para diferentes estruturas
      const orderItems = cartItems.map(item => {
        let productId, quantity, price;
        
        if (item.produto_id) {
          productId = Number(item.produto_id);
          quantity = item.quantity || 1;
          price = item.price || 0;
        } else if (item.product && item.product.id) {
          productId = Number(item.product.id);
          quantity = item.quantity || 1;
          price = item.price || (item.product.price || item.product.pro_precovenda || 0);
        } else if (item.id) {
          productId = Number(item.id);
          quantity = item.quantity || 1;
          price = item.price || 0;
        }
        
        // Converter para número para garantir comparação correta
        const product = availableProducts.find(p => Number(p.id) === productId);
        
        if (!product) {
          this.logger.error(`Produto com ID ${productId} não encontrado nos produtos disponíveis`);
          return null;
        }
        
        return {
          produto_id: product.id,
          quantity: quantity,
          unit_price: price || product.pro_precovenda || 0, // Usar o preço do item, do produto ou um valor padrão
        };
      }).filter(item => item !== null);
      
      const orderDto: CreateOrderDto = {
        profile_id: profileId,
        address_id: addressId,
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
   * Valida se um pedido pode ser processado para pagamento
   * @param orderId ID do pedido
   * @param paymentMethod Método de pagamento
   * @param cardId ID do cartão (opcional)
   */
  async validateOrderForPayment(
    orderId: number,
    paymentMethod: PaymentMethod,
    cardId?: number,
  ): Promise<{ valid: boolean; errors?: string[] }> {
    const errors = [];
    
    // Validar método de pagamento
    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
      errors.push('Método de pagamento inválido');
      return { valid: false, errors };
    }
    
    // Validar cartão se o método de pagamento for cartão
    if (paymentMethod === PaymentMethod.CARD && cardId) {
      try {
        await this.cardService.findOne(cardId);
      } catch (error) {
        errors.push('Cartão não encontrado');
        return { valid: false, errors };
      }
    }
    
    return { valid: true };
  }

  async validaCpf(cpf: string) {
    const profile = await this.profilePFService.findOne({ where: { cpf: cpf } });
    if(profile) {
      return {
        success: false,
        status: 409,
        message: 'Esse cpf já está em uso.',
      };
    }
    else {
      return {
        success: true,
        status: 200,
        message: 'Cpf validado com sucesso!',
      };
    }
  }

  async validaEmail(email: string) {
    const user = await this.userService.findOne({ where: { email: email } });
    if(user) {
      return {
        success: false,
        status: 409,
        message: 'Esse email já está em uso.',
      };
    }
    else {
      return {
        success: true,
        status: 200,
        message: 'Email validado com sucesso!',
      };
    }
  }
} 