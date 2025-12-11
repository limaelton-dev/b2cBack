import { Controller, Get, Patch, Body, UseGuards, UsePipes, ValidationPipe, ForbiddenException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserDto } from '../dto/user.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { instanceToPlain } from 'class-transformer';

@Controller()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async find(@GetUser('userId') userId: number): Promise<UserDto> {
    return this.userService.findOne(userId);
  }

  @Patch()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @GetUser('userId') userId: number, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    const user = await this.userService.update(userId, updateUserDto);
    return instanceToPlain(user);
  }
}
