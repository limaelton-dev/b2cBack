import { IsNotEmpty, IsString } from 'class-validator';

export class CpfDto {
  @IsString()
  @IsNotEmpty()
  cpf: string;

} 