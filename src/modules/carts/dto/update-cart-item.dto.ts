import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  quantity?: number;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  available?: boolean;
}

