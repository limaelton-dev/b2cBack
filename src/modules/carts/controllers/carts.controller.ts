import { Controller,UseGuards, Logger } from '@nestjs/common';
import { CartsService } from '../services/carts.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartsController {
  private readonly logger = new Logger(CartsController.name);
  
  constructor(private readonly cartsService: CartsService) {}

 
} 