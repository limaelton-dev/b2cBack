import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateNested, ValidateIf, Length, Matches, IsNumber } from 'class-validator';
import { ProfileType } from 'src/common/enums';
import { IsCpf, IsCnpj } from 'src/common/validators/document.validator';

class CheckoutProfilePfDto {
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

class CheckoutProfilePjDto {
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

class CheckoutAddressDto {
  @IsOptional()
  @IsNumber({}, { message: 'ID do endereço deve ser um número' })
  id?: number;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  @IsString({ message: 'Rua deve ser uma string' })
  street?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Número é obrigatório' })
  @IsString({ message: 'Número deve ser uma string' })
  number?: string;

  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  complement?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  @IsString({ message: 'Bairro deve ser uma string' })
  neighborhood?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString({ message: 'Cidade deve ser uma string' })
  city?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString({ message: 'Estado deve ser uma string' })
  state?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @IsString({ message: 'CEP deve ser uma string' })
  zipCode?: string;

  @IsOptional()
  @IsBoolean({ message: 'isDefault deve ser um booleano' })
  isDefault?: boolean;
}

class CheckoutPhoneDto {
  @IsOptional()
  @IsNumber({}, { message: 'ID do telefone deve ser um número' })
  id?: number;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'DDD é obrigatório' })
  @IsString({ message: 'DDD deve ser uma string' })
  ddd?: string;

  @ValidateIf(o => !o.id)
  @IsNotEmpty({ message: 'Número do telefone é obrigatório' })
  @IsString({ message: 'Número do telefone deve ser uma string' })
  number?: string;

  @IsOptional()
  @IsBoolean({ message: 'isDefault deve ser um booleano' })
  isDefault?: boolean;
}

class CheckoutCardDto {
  @IsNotEmpty({ message: 'Token do cartão é obrigatório' })
  @IsString({ message: 'Token do cartão deve ser uma string' })
  cardToken: string;

  @IsOptional()
  @IsBoolean({ message: 'Flag de salvar cartão deve ser um booleano' })
  saveCard?: boolean;

  @ValidateIf(o => o.saveCard === true)
  @IsNotEmpty({ message: 'Últimos 4 dígitos são obrigatórios para salvar o cartão' })
  @IsString({ message: 'Últimos 4 dígitos devem ser uma string' })
  @Matches(/^\d{4}$/, { message: 'Últimos 4 dígitos inválidos' })
  lastFourDigits?: string;

  @ValidateIf(o => o.saveCard === true)
  @IsNotEmpty({ message: 'Nome do titular é obrigatório para salvar o cartão' })
  @IsString({ message: 'Nome do titular deve ser uma string' })
  @Length(3, 100, { message: 'Nome do titular deve ter entre 3 e 100 caracteres' })
  holderName?: string;

  @ValidateIf(o => o.saveCard === true)
  @IsNotEmpty({ message: 'Mês de expiração é obrigatório para salvar o cartão' })
  @IsString({ message: 'Mês de expiração deve ser uma string' })
  @Matches(/^(0[1-9]|1[0-2])$/, { message: 'Mês de expiração inválido (01-12)' })
  expirationMonth?: string;

  @ValidateIf(o => o.saveCard === true)
  @IsNotEmpty({ message: 'Ano de expiração é obrigatório para salvar o cartão' })
  @IsString({ message: 'Ano de expiração deve ser uma string' })
  @Matches(/^\d{4}$/, { message: 'Ano de expiração inválido (YYYY)' })
  expirationYear?: string;

  @ValidateIf(o => o.saveCard === true)
  @IsNotEmpty({ message: 'Bandeira do cartão é obrigatória para salvar o cartão' })
  @IsString({ message: 'Bandeira do cartão deve ser uma string' })
  brand?: string;

  @IsOptional()
  @IsBoolean({ message: 'isDefault deve ser um booleano' })
  isDefault?: boolean;
}

export class CheckoutDto {
  @IsNotEmpty({ message: 'Flag de registro é obrigatória' })
  @IsBoolean({ message: 'Flag de registro deve ser um booleano' })
  isRegistered: boolean;

  @ValidateIf(o => o.isRegistered === false)
  @IsNotEmpty({ message: 'Email é obrigatório para novos usuários' })
  @IsString({ message: 'Email deve ser uma string' })
  email?: string;

  @ValidateIf(o => o.isRegistered === false)
  @IsNotEmpty({ message: 'Senha é obrigatória para novos usuários' })
  @IsString({ message: 'Senha deve ser uma string' })
  @Length(6, 100, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
  })
  password?: string;

  @IsNotEmpty({ message: 'Tipo de perfil é obrigatório' })
  @IsEnum(ProfileType, { message: 'Tipo de perfil inválido. Deve ser PF ou PJ' })
  profileType: ProfileType;

  @IsNotEmpty({ message: 'Dados do perfil são obrigatórios' })
  @ValidateNested()
  @Type((opts) => {
    const profileType = opts?.object?.profileType;
    return profileType === ProfileType.PJ ? CheckoutProfilePjDto : CheckoutProfilePfDto;
  })
  profile: CheckoutProfilePfDto | CheckoutProfilePjDto;

  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @ValidateNested()
  @Type(() => CheckoutAddressDto)
  address: CheckoutAddressDto;

  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @ValidateNested()
  @Type(() => CheckoutPhoneDto)
  phone: CheckoutPhoneDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CheckoutCardDto)
  card?: CheckoutCardDto;
}
