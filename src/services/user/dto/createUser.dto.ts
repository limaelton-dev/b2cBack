import { IsEmail, IsEmpty, isEmpty, isNotEmpty, IsNotEmpty, IsOptional, IsString, isString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastname: string;

  @IsOptional()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;
}

export class CreateUserWithoutPassDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  tipoPessoa: string;

  @IsOptional()
  @IsString()
  cpf: string;

  @IsOptional()
  @IsString()
  cnpj: string;
  
  @IsOptional()
  @IsString()
  state_registration: string;

  @IsOptional()
  @IsString()
  company_name: string;

}