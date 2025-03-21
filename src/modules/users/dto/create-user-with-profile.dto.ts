import { IsEmail, IsString, IsNotEmpty, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProfilePfDto } from '../../profiles/dto/create-profile-pf.dto';
import { CreateProfilePjDto } from '../../profiles/dto/create-profile-pj.dto';
import { ProfileType } from '../../../common/enums/profile-type.enum';

// Dados básicos do usuário
export class CreateUserBaseDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

// DTO para criar usuário com perfil PF
export class CreateUserWithProfilePfDto extends CreateUserBaseDto {
  @IsEnum(ProfileType)
  @IsNotEmpty()
  profileType: ProfileType.PF;

  @ValidateNested()
  @Type(() => CreateProfilePfDto)
  @IsNotEmpty()
  profileData: CreateProfilePfDto;
}

// DTO para criar usuário com perfil PJ
export class CreateUserWithProfilePjDto extends CreateUserBaseDto {
  @IsEnum(ProfileType)
  @IsNotEmpty()
  profileType: ProfileType.PJ;

  @ValidateNested()
  @Type(() => CreateProfilePjDto)
  @IsNotEmpty()
  profileData: CreateProfilePjDto;
}

// DTO unificado para aceitar qualquer tipo de perfil
export class CreateUserWithProfileDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(ProfileType)
  @IsNotEmpty()
  profileType: ProfileType;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfilePfDto)
  profilePfData?: CreateProfilePfDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfilePjDto)
  profilePjData?: CreateProfilePjDto;
} 