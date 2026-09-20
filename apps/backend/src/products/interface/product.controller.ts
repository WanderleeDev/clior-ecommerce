import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetProductUseCase,
  ListProductsUseCase,
} from '../application/products.use-cases';
import { Product, ProductNotFoundError } from '../domain/product';
import { ProductDto } from './product.dto';

@ApiTags('Products')
@Controller('api/products')
export class ProductController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({ status: 200, description: 'Products list', type: ProductDto })
  async list(): Promise<Product[]> {
    return this.listProducts.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, description: 'Product detail', type: ProductDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async get(@Param('id') id: string): Promise<Product> {
    try {
      return await this.getProduct.execute(id);
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw new HttpException({ message: error.message }, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }
}
