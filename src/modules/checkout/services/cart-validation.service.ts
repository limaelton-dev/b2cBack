import { Injectable, Logger } from '@nestjs/common';
import { CartValidation, CartItem, CheckoutException } from '../interfaces/checkout.interface';
import { CartService } from '../../cart/services/cart.service';
import { ProductService } from '../../product/services/product.service';
import { CartValidationResponseDto } from '../dto/cart-validation-response.dto';
import { ShippingService } from '../../shipping/services/shipping.service';
import { ShippingItemDto } from '../../shipping/dtos/shipping-item.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CartValidationService {
  private readonly logger = new Logger(CartValidationService.name);

  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly shippingService: ShippingService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Valida o carrinho e calcula os totais (subtotal, frete, descontos, total)
   * @param cartId ID do carrinho a ser validado
   * @param destinationZipCode CEP de destino para cálculo de frete (opcional)
   * @returns Dados de validação do carrinho
   */
  async validateCart(cartId: number, destinationZipCode?: string): Promise<CartValidation> {
    this.logger.log(`Validando carrinho ${cartId}`);
    
    // Buscar o carrinho
    const cart = await this.cartService.getCartById(cartId);
    
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new CheckoutException(
        'CART_EMPTY',
        'O carrinho está vazio',
        { cartId }
      );
    }
    
    // Buscar produtos disponíveis
    const productIds = cart.items.map(item => item.productId);
    const products = await this.productService.findByIds(productIds);
    
    // Validar produtos e calcular subtotal
    const validatedItems: CartItem[] = [];
    let subtotal = 0;
    const errors = [];
    
    for (const item of cart.items) {
      const product = products.find(p => p.id === item.productId);
      
      if (!product) {
        errors.push(`Produto ${item.productId} não encontrado`);
        continue;
      }
      
      // TODO: Verificar estoque quando implementado
      
      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;
      
      subtotal += itemTotal;
      
      validatedItems.push({
        productId: item.productId,
        name: product.name,
        quantity: item.quantity,
        price: itemPrice,
        sku: product.sku,
        stock: product.stock,
        // Estas propriedades são adicionadas como metadados para uso interno
        // e não afetam a compatibilidade com CartItem
        weight: product.weight,
        height: product.height,
        width: product.width,
        length: product.length
      } as any);
    }
    
    // Calcular frete se tivermos o CEP de destino
    let shipping = 0;
    // Opções de serviços de entrega disponíveis
    let shippingOptions = [];
    
    if (destinationZipCode) {
      const originZipCode = this.configService.get<string>('SHIPPING_ORIGIN_ZIPCODE');
      
      if (originZipCode) {
        // Preparar itens para cálculo de frete
        const shippingItems: ShippingItemDto[] = validatedItems.map(item => ({
          productId: item.productId,
          serviceCode: '04014', // SEDEX como padrão, mas o serviço calculará todas as opções
          quantity: item.quantity,
          weight: (item as any).weight || 300, // 300g como padrão
          dimensions: {
            height: (item as any).height,
            width: (item as any).width,
            length: (item as any).length
          }
        }));
        
        // Calcular frete
        try {
          const shippingResult = await this.shippingService.calculateShipping(
            'correios',
            originZipCode,
            destinationZipCode,
            shippingItems
          );
          
          if (shippingResult.success && shippingResult.data) {
            // Usar o preço do serviço padrão (o primeiro retornado, geralmente o mais barato)
            shipping = shippingResult.data.totalPrice;
            
            // Guardar todas as opções de serviço disponíveis (SEDEX, PAC, etc)
            if (shippingResult.data.availableServices && shippingResult.data.availableServices.length > 0) {
              shippingOptions = shippingResult.data.availableServices.map(service => ({
                code: service.serviceCode,
                name: service.serviceName,
                price: service.price,
                deliveryTime: service.deliveryTime,
                isEstimated: service.isEstimated || false
              }));
              
              this.logger.log(`Opções de frete disponíveis: ${JSON.stringify(shippingOptions)}`);
            }
          } else {
            errors.push('Não foi possível calcular o frete: ' + shippingResult.message);
          }
        } catch (error) {
          this.logger.error(`Erro ao calcular frete: ${error.message}`, error.stack);
          errors.push('Erro ao calcular frete');
        }
      } else {
        this.logger.warn('CEP de origem não configurado para cálculo de frete');
      }
    } else {
      // Se não tiver CEP, usar cálculo simplificado
      shipping = this.calculateShipping(validatedItems);
    }
    
    // Calcular descontos (implementar conforme necessidade)
    const discounts = this.calculateDiscounts(subtotal);
    
    // Calcular total
    const total = subtotal + shipping - discounts;
    
    // Verificar se o carrinho é válido
    const isValid = errors.length === 0 && validatedItems.length > 0;
    
    if (!isValid && errors.length > 0) {
      throw new CheckoutException(
        'CART_VALIDATION_ERROR',
        'Erros encontrados na validação do carrinho',
        { errors }
      );
    }
    
    return {
      isValid,
      items: validatedItems,
      total,
      subtotal,
      shipping,
      discounts,
      errors: errors.length > 0 ? errors : undefined,
      // Adicionar opções de frete disponíveis
      shippingOptions: shippingOptions.length > 0 ? shippingOptions : undefined
    };
  }

  /**
   * Calcula o frete usando método simplificado baseado em peso (quando não há CEP)
   */
  private calculateShipping(items: CartItem[]): number {
    // Lógica simplificada de cálculo de frete
    const totalWeight = items.reduce((acc, item) => {
      const weight = (item as any).weight || 300; // Peso padrão de 300g se não especificado
      return acc + (item.quantity * weight / 1000); // Converter para kg
    }, 0);
    
    const baseShipping = 10; // Frete base de R$ 10
    const weightFactor = 5; // R$ 5 por kg
    
    return baseShipping + (totalWeight * weightFactor);
  }

  /**
   * Calcula descontos baseado no valor do subtotal
   */
  private calculateDiscounts(subtotal: number): number {
    // Lógica simplificada de cálculo de descontos
    // Exemplo: 5% de desconto para compras acima de R$ 500
    if (subtotal > 500) {
      return subtotal * 0.05;
    }
    return 0;
  }
} 