import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import type { ProductSort } from '../../../../application/types/product.types';

// ---------------------------------------------------------------------------
// Inbound: validated at the HTTP boundary, mapped to an application input
// before any use case sees them.
// ---------------------------------------------------------------------------

export class CreateProductDto {
  @ApiProperty({ example: 'Clior Croquetas premium 3kg' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'Alimento balanceado marca de la casa' })
  @IsString()
  @MinLength(2)
  description!: string;

  @ApiProperty({ example: 8990, description: 'Price in cents' })
  @IsInt()
  @Min(1)
  priceCents!: number;

  @ApiPropertyOptional({ example: 'https://example.com/img.png' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 'cat-1' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'brand-1' })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  stock?: number;
}

// Every field of an update is optional, and the validation rules are the same
// ones create already declares, so the update derives from it instead of
// repeating them.
export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class UpdateStockDto {
  @ApiPropertyOptional({ example: -3, description: 'Stock delta (negative to decrease)' })
  @IsInt()
  delta!: number;
}

export class ListProductsQueryDto {
  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Opaque cursor from a previous page' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ example: 'cat-1' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'brand-1' })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiPropertyOptional({ example: 'croquetas' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1000, description: 'Minimum price in cents' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 20000, description: 'Maximum price in cents' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  inStock?: boolean;

  @ApiPropertyOptional({ enum: ['newest', 'price_asc', 'price_desc'], default: 'newest' })
  @IsOptional()
  @IsEnum(['newest', 'price_asc', 'price_desc'])
  sort?: ProductSort = 'newest';
}

// ---------------------------------------------------------------------------
// Outbound: the two shapes the catalog actually renders.
// ---------------------------------------------------------------------------

export class ProductListItemDto {
  @ApiProperty({ example: 'p1' })
  id!: string;

  @ApiProperty({ example: 'Sample product' })
  name!: string;

  @ApiProperty({ example: 1999, description: 'Price in cents' })
  priceCents!: number;

  @ApiProperty({ example: 'https://example.com/img.png', required: false })
  imageUrl?: string;

  @ApiProperty({ example: 12, description: 'Units available. Zero means out of stock' })
  stock!: number;
}

export class ProductDetailDto extends ProductListItemDto {
  @ApiProperty({ example: 'A sample product with the full description' })
  description!: string;

  @ApiProperty({ example: 'c1', required: false })
  categoryId?: string;

  @ApiProperty({ example: 'b1', required: false })
  brandId?: string;

  @ApiProperty({ example: '2026-09-23T00:00:00.000Z' })
  createdAt!: Date;
}

export class PaginatedProductListItemDto {
  @ApiProperty({ type: [ProductListItemDto] })
  items!: ProductListItemDto[];

  @ApiProperty({ example: 'eyJjcmVhdGVkQXQiOiIuLi4iLCJpZCI6Ii4uLiJ9', nullable: true })
  nextCursor!: string | null;

  @ApiProperty({ nullable: true })
  prevCursor!: string | null;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}
