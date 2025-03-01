import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, ValidateNested, IsUrl, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PreferenceItemDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  unit_price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  currency_id?: string;

  @IsOptional()
  @IsUrl()
  picture_url?: string;
}

export class BackUrlsDTO {
  @IsUrl()
  @IsOptional()
  success?: string;

  @IsUrl()
  @IsOptional()
  failure?: string;

  @IsUrl()
  @IsOptional()
  pending?: string;
}

export class PreferenceDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreferenceItemDTO)
  items: PreferenceItemDTO[];

  @IsOptional()
  @IsString()
  external_reference?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BackUrlsDTO)
  back_urls?: BackUrlsDTO;

  @IsOptional()
  @IsUrl()
  notification_url?: string;

  @IsOptional()
  @IsString()
  statement_descriptor?: string;

  @IsOptional()
  @IsString()
  @IsIn(['approved', 'all'])
  auto_return?: string;
} 