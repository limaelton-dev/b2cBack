import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { ProfileType } from 'src/common/enums';
import { CreateProfilePfDto } from 'src/modules/profile/dto/create-profile-pf.dto';
import { CreateProfilePjDto } from 'src/modules/profile/dto/create-profile-pj.dto';
import { CreateUserDto } from './create-user.dto';

export class CreateUserWithProfileDto extends CreateUserDto {
  @IsNotEmpty({ message: 'Tipo de perfil é obrigatório' })
  @IsEnum(ProfileType, { message: 'Tipo de perfil inválido. Deve ser PF ou PJ' })
  profileType: ProfileType;

  @IsNotEmpty({ message: 'Dados do perfil são obrigatórios' })
  @ValidateNested({ message: 'Dados do perfil são inválidos' })
  @Type((opts) => {
    const profileType = opts?.object?.profileType;
    return profileType === ProfileType.PJ ? CreateProfilePjDto : CreateProfilePfDto;
  })
  profile: CreateProfilePfDto | CreateProfilePjDto;
} 