import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ListProductsByCategoryQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  page?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  size?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  offset?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number;
}
