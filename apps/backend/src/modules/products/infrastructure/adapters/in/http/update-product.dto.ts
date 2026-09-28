import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Clior Croquetas premium 3kg' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ example: 'Alimento balanceado marca de la casa' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  description?: string;

  @ApiPropertyOptional({ example: 8990, description: 'Price in cents' })
  @IsOptional()
  @IsInt()
  @Min(1)
  priceCents?: number;

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

export class UpdateStockDto {
  @ApiPropertyOptional({ example: -3, description: 'Stock delta (negative to decrease)' })
  @IsInt()
  delta!: number;
}

export class ProductIdDto {
  @ApiPropertyOptional({ example: 'a8098c1a-f86e-11da-bd1a-00112444be1e' })
  @IsUUID()
  id!: string;
}
