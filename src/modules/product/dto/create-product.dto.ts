import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsNotEmpty,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class RelatedEntity {
  @IsInt()
  id: number;
}

export class CreateProductDto {
  @IsInt()
  oracleId: number;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  techDescription?: string;

  @IsString()
  @IsOptional()
  packagingContent?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  stock: number;

  @IsString()
  unit: string;

  @IsString()
  barcode: string;

  @IsString()
  sku: string;

  @IsNumber()
  @IsPositive()
  weight: number;

  @IsNumber()
  @IsPositive()
  height: number;

  @IsNumber()
  @IsPositive()
  width: number;

  @IsNumber()
  @IsPositive()
  length: number;

  @IsString()
  slug: string;

  @ValidateNested()
  @Type(() => RelatedEntity)
  brand: RelatedEntity;

  @ValidateNested()
  @Type(() => RelatedEntity)
  categoryLevel1: RelatedEntity;

  @ValidateNested()
  @Type(() => RelatedEntity)
  @IsOptional()
  categoryLevel2?: RelatedEntity;

  @ValidateNested()
  @Type(() => RelatedEntity)
  @IsOptional()
  categoryLevel3?: RelatedEntity;
}
