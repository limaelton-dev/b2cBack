import { IsNotEmpty, IsIn, IsNumber } from 'class-validator';

export class CreateProfileDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  @IsIn(['PF', 'PJ'])
  profile_type: string;
} 