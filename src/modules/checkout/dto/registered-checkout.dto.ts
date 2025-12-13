import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, ValidateIf, Length, Matches, IsNumber } from 'class-validator';
import { ProfileType } from 'src/common/enums';
import { IsCpf, IsCnpj } from 'src/common/validators/document.validator';

//precisamos adicionar aqui o id para validar sendo obrigatório para usuário autenticado
// (caso usemos em outros lugares esse dto, verificar melhor maneira de implementar.)
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
  @IsOptional()
  @IsNumber()
  id?: number;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  @IsString()
  street?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @IsString()
  neighborhood?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString()
  city?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString()
  state?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

class PhoneDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'DDD é obrigatório' })
  @IsString()
  ddd?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString()
  number?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

class CardDto {
  @IsOptional()
  @IsBoolean()
  saveCard?: boolean;

  @ValidateIf(o => o.saveCard === true)
  @IsNotEmpty({ message: 'Últimos 4 dígitos são obrigatórios' })
  @IsString()
  @Matches(/^\d{4}$/, { message: 'Últimos 4 dígitos inválidos' })
  lastFourDigits?: string;

  @ValidateIf(o => o.saveCard === true)
  @IsNotEmpty({ message: 'Nome do titular é obrigatório' })
  @IsString()
  @Length(3, 100)
  holderName?: string;

  @ValidateIf(o => o.saveCard === true)
  @IsNotEmpty({ message: 'Mês de expiração é obrigatório' })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Mês de expiração inválido' })
  expirationMonth?: string;

  @ValidateIf(o => o.saveCard === true)
  @IsNotEmpty({ message: 'Ano de expiração é obrigatório' })
  @IsString()
  @Matches(/^\d{4}$/, { message: 'Ano de expiração inválido' })
  expirationYear?: string;

  @ValidateIf(o => o.saveCard === true)
  @IsNotEmpty({ message: 'Bandeira é obrigatória' })
  @IsString()
  brand?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class RegisteredCheckoutDto {
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
