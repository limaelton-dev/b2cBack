import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const { accessToken, usuario } = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    
    return {
      status: 200,
      message: 'Login bem-sucedido',
      token: accessToken,
      user: {
        id: usuario.id,
        name: usuario.name,
        username: usuario.username,
        email: usuario.email,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }
} 