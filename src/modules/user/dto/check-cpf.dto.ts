import { IsString, Matches, Length } from 'class-validator';
import { IsCpf } from 'src/common/validators/document.validator';

export class CheckCpfDto {
  @IsString()
  @Length(11, 11, { message: 'CPF deve ter 11 dígitos numéricos' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas números' })
  @IsCpf({ message: 'CPF inválido' })
  value: string;
}
