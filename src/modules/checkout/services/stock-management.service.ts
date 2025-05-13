import { Injectable } from '@nestjs/common';
import { ProductService } from '../../product/services/product.service';
import { CartItem } from '../interfaces/checkout.interface';
import { CheckoutException } from '../interfaces/checkout.interface';

@Injectable()
export class StockManagementService {
  constructor(
    private readonly productService: ProductService,
  ) {}

  async updateStock(items: CartItem[]): Promise<void> {
    try {
      const updatePromises = items.map(item =>
        this.productService.updateStock(item.productId, -item.quantity),
      );

      await Promise.all(updatePromises);
    } catch (error) {
      throw new CheckoutException(
        'STOCK_UPDATE_ERROR',
        'Erro ao atualizar estoque',
        { originalError: error.message },
      );
    }
  }

  async validateStock(items: CartItem[]): Promise<boolean> {
    try {
      const validationPromises = items.map(item =>
        this.productService.validateStock(item.productId, item.quantity),
      );

      const results = await Promise.all(validationPromises);
      return results.every(isValid => isValid);
    } catch (error) {
      throw new CheckoutException(
        'STOCK_VALIDATION_ERROR',
        'Erro ao validar estoque',
        { originalError: error.message },
      );
    }
  }
} 