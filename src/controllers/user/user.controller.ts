import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from 'src/services/user/user.service';
import { User } from 'src/models/user/user';
import { CreateUserDto } from 'src/services/user/dto/createUser.dto';
import { LoginDto } from 'src/services/user/dto/Login.dto';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const { accessToken, usuario} = await this.usersService.validateUser(
            loginDto.email,
            loginDto.password,
        );
        console.log(usuario)
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