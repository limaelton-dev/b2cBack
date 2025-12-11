import { Controller, Get, Query } from '@nestjs/common';
import { UsersAvailabilityService } from '../services/users-availability.service';
import { CheckEmailDto } from '../dto/check-email.dto';
import { CheckCpfDto } from '../dto/check-cpf.dto';

@Controller('users/availability')
export class UsersAvailabilityController {
  constructor(private readonly availabilityService: UsersAvailabilityService) {}

  @Get('email')
  async checkEmail(@Query() query: CheckEmailDto) {
    const { value } = query;
    const available = await this.availabilityService.isEmailAvailable(value);

    return { available };
  }

  @Get('cpf')
  async checkCpf(@Query() query: CheckCpfDto) {
    const { value } = query;
    const available = await this.availabilityService.isCpfAvailable(value);

    return { available };
  }
}