import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from '../services/carts.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Cart } from '../entities/cart.entity';
import { UpsertCartDto } from '../dto/upsert-cart.dto';
import { CartItemDto } from '../dto/cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartsController {
  private readonly logger = new Logger(CartsController.name);
  
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  async findWithItems(@GetUser('profileId') profileId: number): Promise<Cart> {
    return this.cartsService.findWithItems(profileId);
  }

  @Post()
  async upsert(
    @GetUser('userId') userId: number,
    @Body() upsertCartDto: UpsertCartDto,
  ): Promise<Cart> {
    return this.cartsService.upsertCart(userId, upsertCartDto);
  }

  @Post('items')
  async addItem(
    @GetUser('userId') userId: number,
    @Body() cartItemDto: CartItemDto,
  ): Promise<Cart> {
    return this.cartsService.addItem(userId, cartItemDto);
  }
//aqui não sei se é melhor o "itemID ou skuId"(esses produtos são registrados no anymarket)
  @Patch('items/:itemId')
  async updateItem(
    @GetUser('userId') userId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    return this.cartsService.updateItemQuantity(
      userId,
      itemId,
      updateCartItemDto.quantity,
    );
  }

  //aqui não sei se é melhor o "itemID ou skuId"(esses produtos são registrados no anymarket)
  @Delete('items/:itemId')
  async removeItem(
    @GetUser('userId') userId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<Cart> {
    return this.cartsService.removeItem(userId, itemId);
  }

  @Delete('items')
  async clearCart(@GetUser('userId') userId: number): Promise<Cart> {
    return this.cartsService.clearCart(userId);
  }
}