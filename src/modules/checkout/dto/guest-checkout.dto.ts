import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, Length, Matches, IsNumber } from 'class-validator';
import { ProfileType } from 'src/common/enums';
import { IsCpf, IsCnpj } from 'src/common/validators/document.validator';

class ProfilePfDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsCpf({ message: 'CPF inválido' })
  cpf: string;

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @IsString()
  birthDate: string;

  @IsOptional()
  @IsString()
  gender?: string;
}

class ProfilePjDto {
  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  @IsString()
  companyName: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsCnpj({ message: 'CNPJ inválido' })
  cnpj: string;

  @IsOptional()
  @IsString()
  tradingName?: string;

  @IsOptional()
  @IsString()
  stateRegistration?: string;

  @IsOptional()
  @IsString()
  municipalRegistration?: string;
}

class AddressDto {
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  @IsString()
  street: string;

  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @IsString()
  neighborhood: string;

  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString()
  city: string;

  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString()
  state: string;

  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString()
  zipCode: string;
}

class PhoneDto {
  @IsNotEmpty({ message: 'DDD é obrigatório' })
  @IsString()
  ddd: string;

  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString()
  number: string;
}

class CardDto {
  @IsOptional()
  @IsBoolean()
  saveCard?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}$/, { message: 'Últimos 4 dígitos inválidos' })
  lastFourDigits?: string;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  holderName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Mês de expiração inválido' })
  expirationMonth?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}$/, { message: 'Ano de expiração inválido' })
  expirationYear?: string;

  @IsOptional()
  @IsString()
  brand?: string;
}

export class GuestCheckoutDto {
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsString()
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  @Length(6, 100, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
  })
  password: string;

  @IsNotEmpty({ message: 'Tipo de perfil é obrigatório' })
  @IsEnum(ProfileType, { message: 'Tipo de perfil inválido' })
  profileType: ProfileType;

  @IsNotEmpty({ message: 'Dados do perfil são obrigatórios' })
  @ValidateNested()
  @Type((opts) => {
    const profileType = opts?.object?.profileType;
    return profileType === ProfileType.PJ ? ProfilePjDto : ProfilePfDto;
  })
  profile: ProfilePfDto | ProfilePjDto;

  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @ValidateNested()
  @Type(() => PhoneDto)
  phone: PhoneDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CardDto)
  card?: CardDto;
}
