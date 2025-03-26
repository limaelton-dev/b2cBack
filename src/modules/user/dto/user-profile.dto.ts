import { Exclude, Expose, Type } from "class-transformer";
import { ProfileType } from "src/common/enums";

class ProfilePFDto {
    id: number;
    name: string;
    cpf: string;
    birthDate: Date;
    gender?: string;
}

class ProfilePJDto {
    id: number;
    companyName: string;
    cnpj: string;
    tradingName?: string;
    stateRegistration?: string;
    municipalRegistration?: string;
}


export class UserProfileDto {
    id: number;
    email: string;

    @Exclude()
    password?: string;

    @Expose({ name: 'profile_type' })
    profileType?: ProfileType;

    @Expose({ name: 'profile' })
    @Type(() => Object)
    profile?: ProfilePFDto | ProfilePJDto;
}