import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SigninDto } from '../dto/signin.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { CreateUserWithProfileDto } from 'src/modules/user/dto/create-user-with-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async signup(@Body() createUserDto: CreateUserDto | CreateUserWithProfileDto) {
    return this.authService.signup(createUserDto);
  }
} 