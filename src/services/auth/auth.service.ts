import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../models/user/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const payload = { sub: user.id };
    
    const accessToken = this.jwtService.sign(payload);
    
    return {
      accessToken,
      usuario: user
    };
  }

  async login(user: any) {
    const payload = { sub: user.id };
    
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      }
    };
  }

  async refreshToken(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    
    const payload = { sub: user.id };
    
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
} 