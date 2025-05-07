// src/modules/product/dto/create-product-image.dto.ts
import { IsUrl, IsBoolean, IsInt } from 'class-validator';

export class CreateProductImageDto {
  @IsInt()
  productId: number;

  @IsUrl()
  url: string;

  @IsInt()
  position: number;

  @IsBoolean()
  isMain: boolean;
}
