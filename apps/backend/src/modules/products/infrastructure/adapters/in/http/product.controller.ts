import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ListProductsPort } from '../../../../application/ports/in/list-products.port';
import { GetProductPort } from '../../../../application/ports/in/get-product.port';
import { CreateProductPort } from '../../../../application/ports/in/create-product.port';
import { DeleteProductPort, UpdateProductPort, UpdateStockPort } from '../../../../application/ports/in/manage-products.port';
import type { Product } from '../../../../domain/models/product';
import { ListProductsQueryDto } from './list-products-query.dto';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto, UpdateStockDto } from './update-product.dto';
import { PaginatedProductDto, ProductDto } from './product.dto';
import { Public } from '../../../../../../shared/infrastructure/http/public.decorator';
import { Roles } from '../../../../../../shared/infrastructure/http/roles.decorator';
import { RolesGuard } from '../../../../../../shared/infrastructure/http/roles.guard';

@ApiTags('Products')
@Controller('api/products')
export class ProductController {
  constructor(
    private readonly listProducts: ListProductsPort,
    private readonly getProduct: GetProductPort,
    private readonly createProduct: CreateProductPort,
    private readonly updateProduct: UpdateProductPort,
    private readonly adjustStock: UpdateStockPort,
    private readonly deleteProduct: DeleteProductPort,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a product (admin only)' })
  @ApiResponse({ status: 201, description: 'Product created', type: ProductDto })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'Requires admin role' })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.createProduct.execute(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List products with cursor pagination' })
  @ApiResponse({ status: 200, description: 'Paginated products', type: PaginatedProductDto })
  @ApiResponse({ status: 400, description: 'Invalid limit or cursor' })
  async list(@Query() query: ListProductsQueryDto): Promise<PaginatedProductDto> {
    return this.listProducts.execute({
      limit: query.limit ?? 20,
      cursor: query.cursor,
      categoryId: query.categoryId,
      brandId: query.brandId,
      search: query.search,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      inStock: query.inStock,
      sort: query.sort ?? 'newest',
    });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, description: 'Product detail', type: ProductDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async get(@Param('id') id: string): Promise<Product> {
    return this.getProduct.execute(id);
  }

  @Patch(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a product (admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated', type: ProductDto })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'Requires admin role' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<Product> {
    return this.updateProduct.execute(id, dto);
  }

  @Patch(':id/stock')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Adjust product stock (admin only)' })
  @ApiResponse({ status: 200, description: 'Stock updated', type: ProductDto })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'Requires admin role' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto): Promise<Product> {
    return this.adjustStock.execute(id, dto.delta);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a product (admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 401, description: 'Missing or invalid access token' })
  @ApiResponse({ status: 403, description: 'Requires admin role' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProduct.execute(id);
  }
}
