import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/user/user';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { UnauthorizedException, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { ProfileService } from '../profile/profile.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ProfilePFService } from '../profile_pf/profile_pf.service';
import { CreateProfileDto } from '../profile/dto/createProfile.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly cartService: CartService,
        private readonly profileService: ProfileService,
        private readonly profilePFService: ProfilePFService,
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
        
        try {
            // Criar perfil base do tipo PF automaticamente
            this.logger.log(`Criando perfil PF para o usuário ID: ${savedUser.id}`);
            const createProfileDto: CreateProfileDto = {
                user_id: savedUser.id,
                profile_type: 'PF'
            };
            
            const profile = await this.profileService.create(createProfileDto);
            
            // Criar perfil PF vazio
            await this.profilePFService.create(profile.id, {});
            
            this.logger.log(`Perfil PF criado com sucesso para o usuário ID: ${savedUser.id}`);
        } catch (error) {
            this.logger.error(`Erro ao criar perfil para o usuário: ${error.message}`, error.stack);
            // Não vamos falhar a criação do usuário se o perfil falhar
        }
        
        return savedUser;
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }
        return user;
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

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        this.logger.log(`Atualizando usuário com ID: ${id}`);
        
        const user = await this.getUserById(id);
        
        // Verificar se o email já está em uso por outro usuário
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.usersRepository.findOne({ where: { email: updateUserDto.email } });
            if (existingUser && existingUser.id !== id) {
                throw new BadRequestException('Este email já está em uso');
            }
        }
        
        // Verificar se o username já está em uso por outro usuário
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUser = await this.usersRepository.findOne({ where: { username: updateUserDto.username } });
            if (existingUser && existingUser.id !== id) {
                throw new BadRequestException('Este nome de usuário já está em uso');
            }
        }
        
        // Atualizar a senha se fornecida
        if (updateUserDto.password) {
            const salt = await bcrypt.genSalt();
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
        }
        
        // Atualizar os campos do usuário
        Object.assign(user, updateUserDto);
        
        return this.usersRepository.save(user);
    }
}

//teste