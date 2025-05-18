import { Exclude, Expose, Type } from 'class-transformer';
import { ProfileType } from '../../../common/enums/profile-type.enum';

class ProfilePFDto {
  id: number;
  firstName: string;
  lastName: string;
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

class AddressDto {
  id: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

class PhoneDto {
  id: number;
  ddd: string;
  number: string;
  isDefault: boolean;
  verified: boolean;
}

class CardDto {
  id: number;
  cardNumber: string;
  holderName: string;
  expirationDate: string;
  isDefault: boolean;
  brand: string;
}

export class UserDetailsDto {
  id: number;
  email: string;
  
  @Exclude()
  password?: string;
  
  @Expose({ name: 'profile_type' })
  profileType?: ProfileType;
  
  @Expose({ name: 'profile' })
  @Type(() => Object)
  profile?: ProfilePFDto | ProfilePJDto;
  
  @Expose({ name: 'address' })
  @Type(() => AddressDto)
  address?: AddressDto[];
  
  @Expose({ name: 'phone' })
  @Type(() => PhoneDto)
  phone?: PhoneDto[];
  
  @Expose({ name: 'card' })
  @Type(() => CardDto)
  card?: CardDto[];
} 