import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../user/repositories/user.repository';
import { SigninDto } from '../dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { CreateUserWithProfileDto } from 'src/modules/user/dto/create-user-with-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);

    console.log('user validate:', user);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('pass1: ', password);
    console.log('pass2:', user.password);
    console.log('pass validate:', isPasswordValid);
    
    if (!isPasswordValid) {
      return null;
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async signup(createUserDto: CreateUserDto | CreateUserWithProfileDto) {
    const user = await this.userService.create(createUserDto);
    
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
} 