import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Logger } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { CartResponseDto } from '../dto/cart-response.dto';
import { ApplyDiscountDto } from '../dto/apply-discount.dto';
import { ShippingCalculationResponseDto } from '../../shipping/dtos/shipping-calculation-response.dto';
import { RemoveCartItemResponseDto } from '../dto/remove-cart-item-response.dto';
import { UpdateCartItemResponseDto } from '../dto/update-cart-item-response.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  private readonly logger = new Logger(CartController.name);
  
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@GetUser('profileId') profileId: number): Promise<CartResponseDto> {
    return this.cartService.getCartSimplified(profileId);
  }

  @Post('items/addLocal')
  async addLocalCart(
    @GetUser('profileId') profileId: number,
    @Body() addLocalCart: any,
  ): Promise<CartResponseDto> {
    return this.cartService.addLocalCart(profileId, addLocalCart);
  }

  @Post('items')
  async addToCart(
    @GetUser('profileId') profileId: number,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(profileId, addToCartDto);
  }

  @Put('items/:productId')
  async updateCartItem(
    @GetUser('profileId') profileId: number,
    @Param('productId') productId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<UpdateCartItemResponseDto> {
    return this.cartService.updateCartItem(profileId, productId, updateCartItemDto);
  }

  @Put('items/product/:productId')
  async updateCartItemByProductId(
    @GetUser('profileId') profileId: number,
    @Param('productId') productId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<UpdateCartItemResponseDto> {
    return this.cartService.updateCartItemByProductId(profileId, productId, updateCartItemDto);
  }

  @Delete('items/:productId')
  async removeCartItem(
    @GetUser('profileId') profileId: number,
    @Param('productId') productId: number,
  ): Promise<RemoveCartItemResponseDto> {
    return this.cartService.removeCartItem(profileId, productId);
  }

  @Delete('items/product/:productId')
  async removeCartItemByProductId(
    @GetUser('profileId') profileId: number,
    @Param('productId') productId: number,
  ): Promise<RemoveCartItemResponseDto> {
    return this.cartService.removeCartItemByProductId(profileId, productId);
  }

  @Delete()
  async clearCart(@GetUser('profileId') profileId: number): Promise<CartResponseDto> {
    await this.cartService.clearCart(profileId);
    return this.cartService.getCartSimplified(profileId);
  }

  @Post('discount')
  async applyDiscount(
    @GetUser('profileId') profileId: number,
    @Body() applyDiscountDto: ApplyDiscountDto,
  ): Promise<CartResponseDto> {
    return this.cartService.applyDiscount(profileId, applyDiscountDto.code);
  }

  @Post('shipping')
  async calculateShipping(
    @GetUser('profileId') profileId: number,
    @Body('zipCode') zipCode: string,
    @Body('shippingType') shippingType: string = 'ALL',
  ): Promise<ShippingCalculationResponseDto> {
    try {
      this.logger.log(`Calculando frete para o carrinho do perfil ${profileId} com CEP ${zipCode} e tipo ${shippingType}`);
      const result = await this.cartService.calculateShipping(profileId, zipCode, shippingType);
      
      if (result.success) {
        this.logger.log(`Cálculo de frete bem-sucedido: ${result.data?.availableServices?.length || 0} opções disponíveis`);
      } else {
        this.logger.warn(`Falha no cálculo de frete: ${result.message}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Erro não tratado ao calcular frete: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Erro ao processar o cálculo de frete: ${error.message || 'Erro desconhecido'}`,
      };
    }
  }

  @Get('items/product/:productId')
  async getCartItemByProductId(
    @GetUser('profileId') profileId: number,
    @Param('productId') productId: number,
  ) {
    return this.cartService.findCartItemByProductId(profileId, productId);
  }
} 