import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { ProfileType } from 'src/common/enums';
import { CreateProfilePfDto } from 'src/modules/profiles/dto/create-profile-pf.dto';
import { CreateProfilePjDto } from 'src/modules/profiles/dto/create-profile-pj.dto';
import { CreateUserDto } from './create-user.dto';

export class CreateUserWithProfileDto extends CreateUserDto {
  @IsNotEmpty({ message: 'Tipo de perfil é obrigatório' })
  @IsEnum(ProfileType, { message: 'Tipo de perfil inválido. Deve ser PF ou PJ' })
  profileType: ProfileType;

  @IsNotEmpty({ message: 'Dados do perfil são obrigatórios' })
  @ValidateNested()
  @Type(() => Object, {
    discriminator: {
      property: 'profileType',
      subTypes: [
        { value: CreateProfilePfDto, name: ProfileType.PF },
        { value: CreateProfilePjDto, name: ProfileType.PJ }
      ]
    },
    keepDiscriminatorProperty: true
  })
  profile: CreateProfilePfDto | CreateProfilePjDto;
} 