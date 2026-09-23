import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 'p1' })
  id!: string;

  @ApiProperty({ example: 'Sample product' })
  name!: string;

  @ApiProperty({ example: 'A sample product' })
  description!: string;

  @ApiProperty({ example: 1999, description: 'Price in cents' })
  priceCents!: number;

  @ApiProperty({ example: 'https://example.com/img.png', required: false })
  imageUrl?: string;

  @ApiProperty({ example: '2026-09-23T00:00:00.000Z' })
  createdAt!: Date;
}

export class PaginatedProductDto {
  @ApiProperty({ type: [ProductDto] })
  items!: ProductDto[];

  @ApiProperty({ example: 'eyJjcmVhdGVkQXQiOiIuLi4iLCJpZCI6Ii4uLiJ9', nullable: true })
  nextCursor!: string | null;

  @ApiProperty({ nullable: true })
  prevCursor!: string | null;

  @ApiProperty({ example: true })
  hasMore!: boolean;
}
