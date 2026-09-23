import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';

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

export class ProductIdDto {
  @ApiProperty({ example: 'a8098c1a-f86e-11da-bd1a-00112444be1e' })
  @IsUUID()
  id!: string;
}
