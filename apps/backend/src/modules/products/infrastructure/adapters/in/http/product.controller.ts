import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetProductUseCase,
  ListProductsUseCase,
} from '../../../../application/products.use-cases';
import { Product } from '../../../../domain/product';
import { ProductDto } from './product.dto';
import { Public } from '../../../../../../shared/infrastructure/http/public.decorator';

@ApiTags('Products')
@Controller('api/products')
@Public()
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
    return this.getProduct.execute(id);
  }
}
