import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRegistrationService } from '../services/user-registration.service';
import { CreateUserWithProfileDto } from '../dto/create-user-with-profile.dto';
import { User } from '../entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { FrontendOriginGuard } from '../../../common/guards/frontend-origin.guard';
import { UserDto } from '../dto/user.dto';

@ApiTags()
@Controller('/register')
@UseGuards(FrontendOriginGuard)
export class UserRegistrationController {
  constructor(private readonly userRegistrationService: UserRegistrationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar um novo usuário com perfil (PF ou PJ)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário registrado com sucesso com seu perfil',
    type: User,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Dados inválidos para registro' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'E-mail já existe' })
  async registerUserWithProfile(
    @Body() createUserWithProfileDto: CreateUserWithProfileDto,
  ): Promise<UserDto> {
    return this.userRegistrationService.registerUserWithProfile(createUserWithProfileDto);
  }
} 