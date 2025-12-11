import { IsEmail } from 'class-validator';

export class CheckEmailDto {
  @IsEmail()
  value: string;
}
