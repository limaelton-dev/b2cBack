import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user/user';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { name, lastname, email, password } = createUserDto;
    
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const user = this.usersRepository.create({
            name,
            lastname,
            email,
            password: hashedPassword,
        });
    
        return this.usersRepository.save(user);
    }

    async getUserById(id: number): Promise<User> {
        return this.usersRepository.findOne({ where: { id } });
    }

    
    async validateUser(email: string, password: string): Promise<{ accessToken: string, usuario: User }> {
        const user = await this.usersRepository.findOne({ where: { email } });
      
        if (user && (await bcrypt.compare(password, user.password))) {
          const payload = { email: user.email, sub: user.id };
          return {
            accessToken: this.jwtService.sign(payload),
            usuario: user,
          };
        }
      
        throw new UnauthorizedException('Email ou senha incorretos');
      }
}

//teste