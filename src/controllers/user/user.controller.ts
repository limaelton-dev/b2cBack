import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/models/user/user';
import { CreateUserDto } from 'src/services/user/dto/createUser.dto';
import { LoginDto } from 'src/services/user/dto/Login.dto';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post('register')
    async createUser(@Body() createUserDto: CreateUserDto) {
        const r = await this.usersService.create(createUserDto);
        console.log(r)
        if(r) {
            const { accessToken, usuario } = await this.usersService.validateUser(
                r.email,
                createUserDto.password,
            );
            return {
                status: 200,
                message: 'Cadastro realizado com sucesso!',
                token: accessToken,
                user: {
                    id: usuario.id,
                    name: usuario.name,
                    email: usuario.email,
                },
            };
        }
        else {
            return {
                status: 500,
                message: 'Erro ao criar usuário',
            };
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const { accessToken, usuario} = await this.usersService.validateUser(
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
                email: usuario.email,
            },
        };
    }
}