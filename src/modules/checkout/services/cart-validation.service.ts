import { Injectable } from '@nestjs/common';
import { CartValidation, CartItem, CheckoutException } from '../interfaces/checkout.interface';
import { CartService } from '../../cart/services/cart.service';
import { ProductService } from '../../product/services/product.service';

@Injectable()
export class CartValidationService {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async validateCart(cartId: number): Promise<CartValidation> {
    try {
      const cart = await this.cartService.getCartById(cartId);
      
      if (!cart) {
        throw new CheckoutException(
          'CART_NOT_FOUND',
          'Carrinho não encontrado',
          { cartId },
        );
      }

      if (!cart.items || cart.items.length === 0) {
        throw new CheckoutException(
          'CART_EMPTY',
          'O carrinho está vazio',
          { cartId },
        );
      }

      const validation: CartValidation = {
        isValid: true,
        items: [],
        total: 0,
        subtotal: 0,
        shipping: 0,
        discounts: 0,
        errors: [],
      };

      // Validação de cada item do carrinho
      for (const item of cart.items) {
        const product = await this.productService.findOne(item.productId);
        
        if (!product) {
          validation.errors.push(`Produto ${item.productId} não encontrado`);
          validation.isValid = false;
          continue;
        }

        /* Verificação de estoque temporariamente desativada
        if (product.stock < item.quantity) {
          validation.errors.push(
            `Estoque insuficiente para o produto ${product.name}. Disponível: ${product.stock}`,
          );
          validation.isValid = false;
          continue;
        }
        */

        const cartItem: CartItem = {
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          name: product.name,
          sku: product.sku,
          stock: product.stock,
        };

        validation.items.push(cartItem);
        validation.subtotal += product.price * item.quantity;
      }

      // Cálculo do frete (exemplo simplificado)
      validation.shipping = this.calculateShipping(validation.items);

      // Cálculo de descontos (exemplo simplificado)
      validation.discounts = this.calculateDiscounts(validation.subtotal);

      // Cálculo do total
      validation.total = validation.subtotal + validation.shipping - validation.discounts;

      if (!validation.isValid) {
        throw new CheckoutException(
          'CART_VALIDATION_ERROR',
          'Erros encontrados na validação do carrinho',
          { errors: validation.errors },
        );
      }

      return validation;
    } catch (error) {
      if (error instanceof CheckoutException) {
        throw error;
      }
      throw new CheckoutException(
        'CART_VALIDATION_ERROR',
        'Erro ao validar carrinho',
        { originalError: error.message },
      );
    }
  }

  private calculateShipping(items: CartItem[]): number {
    // Lógica simplificada de cálculo de frete
    const totalWeight = items.reduce((acc, item) => acc + (item.quantity * 1), 0); // peso estimado de 1kg por item
    const baseShipping = 10; // frete base
    const weightFactor = 2; // fator de peso

    return baseShipping + (totalWeight * weightFactor);
  }

  private calculateDiscounts(subtotal: number): number {
    // Lógica simplificada de cálculo de descontos
    // Exemplo: 5% de desconto para compras acima de R$ 500
    if (subtotal > 500) {
      return subtotal * 0.05;
    }
    return 0;
  }
} 