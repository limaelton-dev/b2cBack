import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserDetailsDto } from '../dto/user-details.dto';
import { FrontendOriginGuard } from '../../../common/guards/frontend-origin.guard';

@Controller('user')
@UseGuards(JwtAuthGuard, FrontendOriginGuard)
export class UserDetailsController {
  constructor(private readonly usersService: UsersService) {}

  @Get('details')
  async getUserDetails(@Request() req): Promise<UserDetailsDto> {
    const userId = req.user.userId;
    return this.usersService.findUserDetails(userId);
  }
} 