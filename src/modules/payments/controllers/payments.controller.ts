import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { Payment } from '../entities/payment.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll(): Promise<Payment[]> {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Payment> {
    return this.paymentsService.findOne(+id);
  }

  @Get('order/:orderId')
  async findByOrderId(@Param('orderId') orderId: string): Promise<Payment[]> {
    return this.paymentsService.findByOrderId(+orderId);
  }

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentsService.create(createPaymentDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdatePaymentStatusDto,
  ): Promise<Payment> {
    return this.paymentsService.updateStatus(+id, updateStatusDto.status);
  }

  @Get('methods')
  async getAllPaymentMethods() {
    return this.paymentsService.getAllPaymentMethods();
  }

  @Get('methods/:id')
  async getPaymentMethod(@Param('id') id: string) {
    return this.paymentsService.getPaymentMethod(+id);
  }
} 