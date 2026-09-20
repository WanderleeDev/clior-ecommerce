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
}
