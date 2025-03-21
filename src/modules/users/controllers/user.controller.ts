import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { FrontendOriginGuard } from 'src/common/guards/frontend-origin.guard';
import { UserProfileDto } from '../dto/user-profile.dto';
import { UserProfileDetailsDto } from '../dto/user-profile-details.dto';
import { UserDto } from '../dto/user.dto';

@Controller()
@UseGuards(JwtAuthGuard, FrontendOriginGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async find(@Request() req): Promise<UserDto> {
    const userId = req.user.userId;
    return this.userService.findOne(userId);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(+id);
  }
} 