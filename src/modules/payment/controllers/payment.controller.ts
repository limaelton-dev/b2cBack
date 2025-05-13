import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { Payment } from '../entities/payment.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';

@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Payment> {
    return this.paymentService.findOne(+id);
  }

  @Get('order/:orderId')
  async findByOrderId(@Param('orderId') orderId: number): Promise<Payment[]> {
    return this.paymentService.findByOrderId(orderId);
  }

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdatePaymentStatusDto,
  ): Promise<Payment> {
    return this.paymentService.updateStatus(id, updateStatusDto.status);
  }

  @Get('methods')
  async getAllPaymentMethods() {
    return this.paymentService.getAllPaymentMethods();
  }

  @Get('methods/:id')
  async getPaymentMethod(@Param('id') id: number) {
    return this.paymentService.getPaymentMethod(id);
  }
} 