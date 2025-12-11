import { Validate, IsNotEmpty, IsString, IsOptional, IsDate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Type } from 'class-transformer';
import { IsCpf } from 'src/common/validators/document.validator';

@ValidatorConstraint({ name: 'isValidBirthDate', async: false })
export class IsValidBirthDate implements ValidatorConstraintInterface {
  validate(date: Date, args: ValidationArguments) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return false;
    }
    
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());

    return date <= now && date >= minDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Data de nascimento inválida. Deve ser uma data passada e a idade máxima é 120 anos';
  }
}

export class CreateProfilePfDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  firstName: string;

  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  @IsString({ message: 'Sobrenome deve ser uma string' })
  lastName: string;

  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString({ message: 'CPF deve ser uma string' })
  @IsCpf({ message: 'CPF inválido' })
  cpf: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @Type(() => Date)
  @IsDate({ message: 'Data de nascimento inválida. Utilize o formato YYYY-MM-DD' })
  @Validate(IsValidBirthDate)
  birthDate: Date;

  @IsOptional()
  @IsString({ message: 'Gênero deve ser uma string' })
  gender?: string;
} 