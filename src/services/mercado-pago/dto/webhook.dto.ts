import { IsNotEmpty, IsString, IsObject, IsOptional } from 'class-validator';

export class WebhookDTO {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsObject()
  @IsNotEmpty()
  data: {
    id: string | number;
  };

  @IsOptional()
  @IsString()
  date_created?: string;

  @IsOptional()
  @IsString()
  application_id?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  version?: string;
} 