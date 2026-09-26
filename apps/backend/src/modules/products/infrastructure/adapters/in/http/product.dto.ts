import { ApiProperty } from '@nestjs/swagger';

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
