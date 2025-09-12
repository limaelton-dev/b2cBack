import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { ProductsService } from '../../products/services/products.service';
import { DiscountService } from '../../discount/services/discount.service';
import { CartRepository } from '../repositories/cart.repository';
import { CartItemRepository } from '../repositories/cart-item.repository';
import { CartResponseDto, CartItemResponseDto } from '../dto/cart-response.dto';
import { ShippingService } from '../../shipping/services/shipping.service';
import { ShippingCalculationResponseDto } from '../../shipping/dtos/shipping-calculation-response.dto';
import { ShippingItemDto } from '../../shipping/dtos/shipping-item.dto';
import { ConfigService } from '@nestjs/config';
import { RemoveCartItemResponseDto } from '../dto/remove-cart-item-response.dto';
import { UpdateCartItemResponseDto } from '../dto/update-cart-item-response.dto';

@Injectable()
export class CartService {
  constructor(
    private cartRepository: CartRepository,
    private cartItemRepository: CartItemRepository,
    private productsService: ProductsService,
    private discountService: DiscountService,
    private shippingService: ShippingService,
    private configService: ConfigService,
  ) {}

  async getCart(profileId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOneByProfileId(profileId);

    if (!cart) {
      cart = await this.createCart(profileId);
    }

    return cart;
  }

  // Método para buscar carrinho pelo ID
  async getCartById(cartId: number): Promise<Cart> {
    console.log('CartService.getCartById:', { cartId });
    const cart = await this.cartRepository.findOne(cartId);
    if (!cart) {
      throw new NotFoundException(`Carrinho com ID ${cartId} não encontrado`);
    }
    return cart;
  }

  // Método para buscar a existência desse produto no carrinho
  async verifyProductsCart(productsId: Array<number>, cartId: number, ): Promise<boolean> {
    console.log('CartService.getCartById:', { cartId });
    const cart = await this.cartItemRepository.verifyProduct(productsId, cartId);
    return cart ? true : false;
  }

  // Método compatível com a nova interface do checkout
  async findByProfileId(profileId: number): Promise<Cart> {
    console.log('CartService.findByProfileId:', { profileId });
    return this.cartRepository.findOneByProfileId(profileId);
  }

  // Método compatível com a nova interface do checkout
  async create(profileId: number): Promise<Cart> {
    console.log('CartService.create:', { profileId });
    return this.createCart(profileId);
  }

  async getCartSimplified(profileId: number): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    return this.mapToCartResponse(cart);
  }

  private mapToCartResponse(cart: Cart): CartResponseDto {
    const responseDto = new CartResponseDto();
    responseDto.id = cart.id;
    responseDto.subtotal = cart.subtotal;
    responseDto.total = cart.total;
    responseDto.items = cart.items?.map(item => {
      const itemDto = new CartItemResponseDto();
      itemDto.id = item.id;
      itemDto.productId = item.productId;
      itemDto.quantity = item.quantity;
      return itemDto;
    }) || [];
    return responseDto;
  }

  private async createCart(profileId: number): Promise<Cart> {
    console.log('CartService.createCart:', { profileId });
    const cart = await this.cartRepository.create({
      profileId,
      subtotal: 0,
      total: 0,
    });
    cart.items = [];
    return cart;
  }

  async addLocalCart(profileId: number, addLocalCart: any): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    console.log(addLocalCart.dataItems)
    if (cart && this.verifyProductsCart(addLocalCart.dataItems.map(p => p.id), cart.id)) {
      
      const cartItem = addLocalCart.dataItems.map(p => ({
        cartId: cart.id,
        productId: p.id,
        quantity: p.quantity,
        unitPrice: p.price,
        totalPrice: Number(p.price) * Number(p.quantity),
      }));
      cart.items.push(cartItem);
      await this.cartItemRepository.save(cartItem);
      await this.updateCartTotals(cart);
  
      return this.getCartSimplified(profileId);
    }

  }

  async addToCart(profileId: number, addToCartDto: AddToCartDto): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    const product = await this.productsService.findOne(addToCartDto.productId);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    let cartItem = cart.items.find(item => item.productId === product.id);

    if (cartItem) {
      cartItem.quantity += addToCartDto.quantity;
      cartItem.totalPrice = Number((cartItem.quantity * Number(cartItem.unitPrice)).toFixed(2));
    } else {
      const unitPrice = Number(product.price);
      const totalPrice = Number((addToCartDto.quantity * unitPrice).toFixed(2));
      
      cartItem = await this.cartItemRepository.create({
        cartId: cart.id,
        productId: product.id,
        quantity: addToCartDto.quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
      });
      cart.items.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);
    await this.updateCartTotals(cart);

    return this.getCartSimplified(profileId);
  }

  async updateCartItem(
    profileId: number,
    productId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<UpdateCartItemResponseDto> {
    // Obter o carrinho do usuário
    const cart = await this.getCart(profileId);
    
    // Buscar todos os itens deste carrinho
    const cartItems = await this.cartItemRepository.findByCartId(cart.id);
    
    // Encontrar o item com o productId desejado
    const cartItem = cartItems.find(item => item.productId === productId);
    
    if (!cartItem) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado no carrinho`);
    }

    // Atualizar a quantidade
    cartItem.quantity = updateCartItemDto.quantity;
    // Certifica-se de que o preço total é um número formatado corretamente
    cartItem.totalPrice = Number((cartItem.quantity * Number(cartItem.unitPrice)).toFixed(2));

    // Garantir que cartId está definido para evitar NULL
    cartItem.cartId = cart.id;
    
    await this.cartItemRepository.save(cartItem);
    
    // Recarregar o carrinho para ter os itens atualizados
    const updatedCart = await this.cartRepository.findOne(cart.id);
    updatedCart.items = await this.cartItemRepository.findByCartId(cart.id);
    await this.updateCartTotals(updatedCart);

    return {
      productId,
      cart: this.mapToCartResponse(updatedCart)
    };
  }

  async removeCartItem(
    profileId: number,
    productId: number,
  ): Promise<RemoveCartItemResponseDto> {
    // Obter o carrinho do usuário
    const cart = await this.getCart(profileId);
    
    // Buscar todos os itens deste carrinho
    const cartItems = await this.cartItemRepository.findByCartId(cart.id);
    
    // Encontrar o item com o productId desejado
    const cartItem = cartItems.find(item => item.productId === productId);
    
    if (!cartItem) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado no carrinho`);
    }
    
    // Remove do banco de dados usando delete em vez de remove
    await this.cartItemRepository.remove(cartItem);
    
    // Recarregar o carrinho diretamente do banco de dados
    const updatedCart = await this.cartRepository.findOne(cart.id);
    updatedCart.items = await this.cartItemRepository.findByCartId(cart.id);
    await this.updateCartTotals(updatedCart);
    
    // Retorna o ID do produto e o carrinho atualizado
    return {
      productId,
      cart: this.mapToCartResponse(updatedCart)
    };
  }

  async applyDiscount(
    profileId: number,
    discountCode: string,
  ): Promise<CartResponseDto> {
    const cart = await this.getCart(profileId);
    const discount = await this.discountService.findByCode(discountCode);

    if (!discount) {
      throw new NotFoundException('Cupom de desconto não encontrado');
    }

    cart.discountId = discount.id;
    await this.updateCartTotals(cart);

    return this.getCartSimplified(profileId);
  }

  private async updateCartTotals(cart: Cart): Promise<void> {
    const subtotal = Number(
      cart.items.reduce((sum, item) => sum + Number(item.totalPrice), 0).toFixed(2)
    );
    
    cart.subtotal = subtotal;

    if (cart.discountId) {
      const discount = await this.discountService.findOne(cart.discountId);
      if (discount) {
        cart.total = Number(
          (await this.calculateDiscountedTotal(subtotal, discount)).toFixed(2)
        );
      } else {
        cart.total = subtotal;
      }
    } else {
      cart.total = subtotal;
    }

    // Salvar apenas os campos que precisamos atualizar no carrinho
    await this.cartRepository.update(cart.id, {
      subtotal: cart.subtotal,
      total: cart.total,
      discountId: cart.discountId
    });
  }

  private async calculateDiscountedTotal(
    subtotal: number,
    discount: any,
  ): Promise<number> {
    let result = 0;
    switch (discount.unit) {
      case 'percentage':
        result = subtotal * (1 - discount.percentage / 100);
        break;
      case 'fixed':
        result = Math.max(0, subtotal - discount.fixedAmount);
        break;
      case 'free_shipping':
        result = subtotal;
        break;
      default:
        result = subtotal;
    }
    // Retorna o valor formatado para 2 casas decimais
    return Number(result.toFixed(2));
  }

  async clearCart(profileId: number): Promise<void> {
    let cart: Cart;

    cart = await this.getCart(profileId);

    if (!cart) {
      throw new NotFoundException('Carrinho não encontrado');
    }

    await this.cartItemRepository.deleteByCartId(cart.id);
    
    cart.items = [];
    cart.subtotal = 0;
    cart.total = 0;

    await this.cartRepository.save(cart);
  }

  async updateCartItemByProductId(
    profileId: number,
    productId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<UpdateCartItemResponseDto> {
    // Simplesmente reutilizar o método updateCartItem, já que agora ele usa o productId
    return this.updateCartItem(profileId, productId, updateCartItemDto);
  }

  async removeCartItemByProductId(
    profileId: number,
    productId: number,
  ): Promise<RemoveCartItemResponseDto> {
    // Simplesmente reutilizar o método removeCartItem, já que agora ele usa o productId
    return this.removeCartItem(profileId, productId);
  }

  async calculateShipping(
    profileId: number,
    destinationZipCode: string,
    shippingType: string = 'ALL',
  ): Promise<ShippingCalculationResponseDto> {
    const cart = await this.getCart(profileId);

    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        success: false,
        message: 'O carrinho está vazio',
      };
    }

    if (!destinationZipCode) {
      return {
        success: false,
        message: 'CEP de destino é obrigatório',
      };
    }

    // Buscar o CEP de origem nas configurações
    const originZipCode = this.configService.get<string>('CORREIOS_CEP_ORIGEM');
    if (!originZipCode) {
      return {
        success: false,
        message: 'CEP de origem não configurado',
      };
    }

    // Obter os dados dos produtos no carrinho
    const productIds = cart.items.map(item => item.productId);
    const products = await this.productsService.findByIds(productIds);

    // Transformar itens do carrinho em itens para cálculo de frete
    const shippingItems: ShippingItemDto[] = [];
    
    for (const cartItem of cart.items) {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) continue;

      // Determinar o código de serviço com base no tipo de frete
      // Por padrão, usamos o tipo ALL para calcular todas as opções
      const serviceCode = shippingType?.toUpperCase() === 'PAC' ? '04669' : 
                          shippingType?.toUpperCase() === 'SEDEX' ? '04014' : 
                          '04014'; // SEDEX como padrão para cálculo conjunto

      shippingItems.push({
        productId: cartItem.productId,
        serviceCode: serviceCode,
        quantity: cartItem.quantity,
        weight: product.weight || 300, // 300g como padrão se não especificado
        dimensions: {
          height: product.height || 10, // 10cm como padrão
          width: product.width || 10,   // 10cm como padrão
          length: product.length || 10  // 10cm como padrão
        }
      });
    }

    try {
      // Calcular o frete usando o serviço de frete
      return await this.shippingService.calculateShipping(
        'simulation', // Provedor padrão
        originZipCode,
        destinationZipCode,
        shippingItems
      );
    } catch (error) {
      // Se o erro estiver relacionado com o PAC não disponível, fazer fallback para SEDEX apenas
      if (error.message && 
          (error.message.includes('400') || 
           error.message.includes('Classificaçao de preço') || 
           error.message.includes('não foi encontrada na proposta de preço'))) {
        try {
          // Forçar o cálculo apenas para SEDEX
          console.log('Erro no cálculo de PAC, fazendo fallback para apenas SEDEX');
          
          // Atualizar todos os itens para usar apenas SEDEX
          shippingItems.forEach(item => item.serviceCode = '04014');
          
          return await this.shippingService.calculateShipping(
            'correios',
            originZipCode,
            destinationZipCode,
            shippingItems
          );
        } catch (fallbackError) {
          return {
            success: false,
            message: `Erro ao calcular frete (mesmo com fallback): ${fallbackError.message || 'Erro desconhecido'}`,
          };
        }
      }
      
      return {
        success: false,
        message: `Erro ao calcular frete: ${error.message || 'Erro desconhecido'}`,
      };
    }
  }

  // Método auxiliar para buscar um item do carrinho pelo ID do produto
  async findCartItemByProductId(
    profileId: number,
    productId: number,
  ): Promise<{ itemId: number; productId: number }> {
    // Obter o carrinho do usuário
    const cart = await this.getCart(profileId);
    
    // Buscar todos os itens deste carrinho
    const cartItems = await this.cartItemRepository.findByCartId(cart.id);
    
    // Encontrar o item com o productId desejado
    const cartItem = cartItems.find(item => item.productId === productId);
    
    if (!cartItem) {
      throw new NotFoundException(`Produto com ID ${productId} não encontrado no carrinho`);
    }
    
    return {
      itemId: cartItem.id,
      productId: cartItem.productId
    };
  }

  async calculateShipping2(
    profileId: number,
    destinationZipCode: string,
    shippingType: string = 'ALL',
  ): Promise<ShippingCalculationResponseDto> {
    const cart = await this.getCart(profileId);

    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        success: false,
        message: 'O carrinho está vazio',
      };
    }

    if (!destinationZipCode) {
      return {
        success: false,
        message: 'CEP de destino é obrigatório',
      };
    }

    // Buscar o CEP de origem nas configurações
    const originZipCode = this.configService.get<string>('CORREIOS_CEP_ORIGEM');
    if (!originZipCode) {
      return {
        success: false,
        message: 'CEP de origem não configurado',
      };
    }

    // Obter os dados dos produtos no carrinho
    const productIds = cart.items.map(item => item.productId);
    const products = await this.productsService.findByIds(productIds);

    // Transformar itens do carrinho em itens para cálculo de frete
    const shippingItems: ShippingItemDto[] = [];
    
    for (const cartItem of cart.items) {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) continue;

      // Determinar o código de serviço com base no tipo de frete
      // Por padrão, usamos o tipo ALL para calcular todas as opções
      const serviceCode = shippingType?.toUpperCase() === 'PAC' ? '04669' : 
                          shippingType?.toUpperCase() === 'SEDEX' ? '04014' : 
                          '04014'; // SEDEX como padrão para cálculo conjunto

      shippingItems.push({
        productId: cartItem.productId,
        serviceCode: serviceCode,
        quantity: cartItem.quantity,
        weight: product.weight || 300, // 300g como padrão se não especificado
        dimensions: {
          height: product.height || 10, // 10cm como padrão
          width: product.width || 10,   // 10cm como padrão
          length: product.length || 10  // 10cm como padrão
        }
      });
    }

    try {
      // Calcular o frete usando o serviço de frete
      return await this.shippingService.calculateShipping(
        'correios', // Provedor padrão
        originZipCode,
        destinationZipCode,
        shippingItems
      );
    } catch (error) {
      // Se o erro estiver relacionado com o PAC não disponível, fazer fallback para SEDEX apenas
      if (error.message && 
          (error.message.includes('400') || 
           error.message.includes('Classificaçao de preço') || 
           error.message.includes('não foi encontrada na proposta de preço'))) {
        try {
          // Forçar o cálculo apenas para SEDEX
          console.log('Erro no cálculo de PAC, fazendo fallback para apenas SEDEX');
          
          // Atualizar todos os itens para usar apenas SEDEX
          shippingItems.forEach(item => item.serviceCode = '04014');
          
          return await this.shippingService.calculateShipping(
            'correios',
            originZipCode,
            destinationZipCode,
            shippingItems
          );
        } catch (fallbackError) {
          return {
            success: false,
            message: `Erro ao calcular frete (mesmo com fallback): ${fallbackError.message || 'Erro desconhecido'}`,
          };
        }
      }
      
      return {
        success: false,
        message: `Erro ao calcular frete: ${error.message || 'Erro desconhecido'}`,
      };
    }
  }
} 