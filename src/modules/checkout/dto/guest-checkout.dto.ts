import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, Length, Matches } from 'class-validator';
import { ProfileType } from 'src/common/enums';
import { IsCpf, IsCnpj } from 'src/common/validators/document.validator';

class GuestProfilePfDto {
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
  @IsString({ message: 'Data de nascimento deve ser uma string' })
  birthDate: string;

  @IsOptional()
  @IsString({ message: 'Gênero deve ser uma string' })
  gender?: string;
}

class GuestProfilePjDto {
  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  @IsString({ message: 'Razão social deve ser uma string' })
  companyName: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @IsCnpj({ message: 'CNPJ inválido' })
  cnpj: string;

  @IsOptional()
  @IsString({ message: 'Nome fantasia deve ser uma string' })
  tradingName?: string;

  @IsOptional()
  @IsString({ message: 'Inscrição estadual deve ser uma string' })
  stateRegistration?: string;

  @IsOptional()
  @IsString({ message: 'Inscrição municipal deve ser uma string' })
  municipalRegistration?: string;
}

class GuestAddressDto {
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  @IsString({ message: 'Rua deve ser uma string' })
  street: string;

  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString({ message: 'Número deve ser uma string' })
  number: string;

  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  complement?: string;

  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @IsString({ message: 'Bairro deve ser uma string' })
  neighborhood: string;

  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString({ message: 'Cidade deve ser uma string' })
  city: string;

  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString({ message: 'Estado deve ser uma string' })
  state: string;

  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString({ message: 'CEP deve ser uma string' })
  zipCode: string;
}

class GuestPhoneDto {
  @IsNotEmpty({ message: 'DDD é obrigatório' })
  @IsString({ message: 'DDD deve ser uma string' })
  ddd: string;

  @IsNotEmpty({ message: 'Número do telefone é obrigatório' })
  @IsString({ message: 'Número do telefone deve ser uma string' })
  number: string;
}

class GuestCardDto {
  @IsNotEmpty({ message: 'Últimos 4 dígitos do cartão são obrigatórios' })
  @IsString({ message: 'Últimos 4 dígitos devem ser uma string' })
  @Matches(/^\d{4}$/, { message: 'Últimos 4 dígitos inválidos' })
  lastFourDigits: string;

  @IsNotEmpty({ message: 'Nome do titular é obrigatório' })
  @IsString({ message: 'Nome do titular deve ser uma string' })
  @Length(3, 100, { message: 'Nome do titular deve ter entre 3 e 100 caracteres' })
  holderName: string;

  @IsNotEmpty({ message: 'Mês de expiração é obrigatório' })
  @IsString({ message: 'Mês de expiração deve ser uma string' })
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Mês de expiração inválido (01-12)' })
  expirationMonth: string;

  @IsNotEmpty({ message: 'Ano de expiração é obrigatório' })
  @IsString({ message: 'Ano de expiração deve ser uma string' })
  @Matches(/^\d{4}$/, { message: 'Ano de expiração inválido (YYYY)' })
  expirationYear: string;

  @IsNotEmpty({ message: 'Bandeira do cartão é obrigatória' })
  @IsString({ message: 'Bandeira do cartão deve ser uma string' })
  brand: string;
}

export class GuestCheckoutDto {
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsString({ message: 'Email deve ser uma string' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  @Length(6, 100, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
  })
  password: string;

  @IsNotEmpty({ message: 'Tipo de perfil é obrigatório' })
  @IsEnum(ProfileType, { message: 'Tipo de perfil inválido. Deve ser PF ou PJ' })
  profileType: ProfileType;

  @IsNotEmpty({ message: 'Dados do perfil são obrigatórios' })
  @ValidateNested()
  @Type((opts) => {
    const profileType = opts?.object?.profileType;
    return profileType === ProfileType.PJ ? GuestProfilePjDto : GuestProfilePfDto;
  })
  profile: GuestProfilePfDto | GuestProfilePjDto;

  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @ValidateNested()
  @Type(() => GuestAddressDto)
  address: GuestAddressDto;

  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @ValidateNested()
  @Type(() => GuestPhoneDto)
  phone: GuestPhoneDto;

  @IsNotEmpty({ message: 'Dados do cartão são obrigatórios' })
  @ValidateNested()
  @Type(() => GuestCardDto)
  card: GuestCardDto;
}

