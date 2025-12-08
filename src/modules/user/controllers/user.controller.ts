import { Controller, Get, Patch, Param, Body, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserDto } from '../dto/user.dto';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async find(@GetUser('userId') userId: number): Promise<UserDto> {
    return this.userService.findOne(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }
} 