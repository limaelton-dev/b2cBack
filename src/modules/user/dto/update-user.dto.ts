import { IsEmail, IsOptional, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @IsOptional()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
  })
  password?: string;
}
