import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsNotEmpty
} from 'class-validator';

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

  @IsInt()
  brandId: number;

  @IsInt()
  categoryLevel1Id: number;

  @IsInt()
  categoryLevel2Id: number;

  @IsOptional()
  @IsInt()
  categoryLevel3Id?: number;
}
