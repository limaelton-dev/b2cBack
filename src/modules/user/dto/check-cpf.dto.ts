// check-cpf.dto.ts
import { IsString, Matches, Length } from 'class-validator';

export class CheckCpfDto {
  @IsString()
  @Length(11, 11, { message: 'CPF deve ter 11 dígitos numéricos' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas números' })
  value: string;
}
