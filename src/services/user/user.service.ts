import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user/user';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly cartService: CartService,
        private readonly profileService: ProfileService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        this.logger.log(`Criando novo usuário: ${createUserDto.email}`);
        
        const { name, lastname, username, email, password } = createUserDto;
    
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const user = this.usersRepository.create({
            name,
            lastname,
            username,
            email,
            password: hashedPassword,
        });
    
        const savedUser = await this.usersRepository.save(user);
        
        // Não criamos mais o carrinho diretamente aqui
        // O carrinho será criado quando o perfil for criado
        // ou quando o usuário acessar o carrinho pela primeira vez
        
        return savedUser;
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
      
        throw new UnauthorizedException('Credenciais inválidas');
    }
}

//teste