import { Transform, Type } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString, Min } from "class-validator";

export class ProductsFiltersDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    size?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
    term?: string;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (!value) return undefined;
        if (Array.isArray(value)) return value;
        return String(value).split(',').map(id => id.trim()).filter(Boolean);
    })
    categories?: (string | number)[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (!value) return undefined;
        if (Array.isArray(value)) return value;
        return String(value).split(',').map(id => id.trim()).filter(Boolean);
    })
    brands?: (string | number)[];
}