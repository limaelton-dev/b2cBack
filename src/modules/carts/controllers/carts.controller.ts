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
import { CartWithDetailsDto } from '../dto/cart-with-details.dto';
import { CartPreviewDto } from '../dto/cart-preview.dto';

@Controller('cart')
export class CartsController {
  private readonly logger = new Logger(CartsController.name);

  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findWithItems(@GetUser('profileId') profileId: number): Promise<Cart> {
    return this.cartsService.findWithItems(profileId);
  }

  @Get('details')
  @UseGuards(JwtAuthGuard)
  async findWithDetails(
    @GetUser('profileId') profileId: number,
  ): Promise<CartWithDetailsDto> {
    return this.cartsService.findWithDetails(profileId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async upsert(
    @GetUser('profileId') profileId: number,
    @Body() upsertCartDto: UpsertCartDto,
  ): Promise<Cart> {
    return this.cartsService.upsertCart(profileId, upsertCartDto);
  }

  @Post('items')
  @UseGuards(JwtAuthGuard)
  async addItem(
    @GetUser('profileId') profileId: number,
    @Body() cartItemDto: CartItemDto,
  ): Promise<Cart> {
    return this.cartsService.addItem(profileId, cartItemDto);
  }

  @Patch('items/:itemId')
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @GetUser('profileId') profileId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    return this.cartsService.updateItem(profileId, itemId, updateCartItemDto);
  }

  @Delete('items/:itemId')
  @UseGuards(JwtAuthGuard)
  async removeItem(
    @GetUser('profileId') profileId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<Cart> {
    return this.cartsService.removeItem(profileId, itemId);
  }

  @Delete('items')
  @UseGuards(JwtAuthGuard)
  async clearCart(
    @GetUser('profileId') profileId: number,
  ): Promise<Cart> {
    return this.cartsService.clearCart(profileId);
  }

  @Post('details/preview')
  async previewDetails(
    @Body() dto: CartPreviewDto,
  ): Promise<CartWithDetailsDto> {
    return this.cartsService.previewDetailsFromPayload(dto);
  }
}
