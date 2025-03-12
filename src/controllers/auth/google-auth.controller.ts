import { Controller, Post, Body } from '@nestjs/common';
import { GoogleAuthService } from '../../services/auth/google-auth.service';

@Controller('user')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post('google-login')
  async googleLogin(@Body() body: { credential: string }) {
    return this.googleAuthService.validateGoogleToken(body.credential);
  }
} 