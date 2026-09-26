import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListProductsPort } from '../../../../application/ports/in/list-products.port';
import { GetProductPort } from '../../../../application/ports/in/get-product.port';
import { CreateProductPort } from '../../../../application/ports/in/create-product.port';
import { DeleteProductPort, UpdateProductPort, UpdateStockPort } from '../../../../application/ports/in/manage-products.port';
import { ListProductsQueryDto } from './list-products-query.dto';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto, UpdateStockDto } from './update-product.dto';
import { PaginatedProductListItemDto, ProductDetailDto } from './product.dto';
import { ProductMapper } from './product.mapper';
import { Public } from '../../../../../../shared/infrastructure/http/decorators/public.decorator';
import { ApiResponses } from '../../../../../../shared/infrastructure/http/decorators/api-responses.decorator';
import { AdminOnly } from '../../../../../../shared/infrastructure/http/decorators/admin-only.decorator';

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
  @AdminOnly()
  @ApiOperation({ summary: 'Create a product (admin only)' })
  @ApiResponses(
    { status: 201, description: 'Product created', type: ProductDetailDto },
    { status: 401, description: 'Missing or invalid access token' },
    { status: 403, description: 'Requires admin role' },
  )
  async create(@Body() dto: CreateProductDto): Promise<ProductDetailDto> {
    return ProductMapper.toDetail(await this.createProduct.execute(dto));
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'List products with cursor pagination' })
  @ApiResponses(
    { status: 200, description: 'Paginated product cards', type: PaginatedProductListItemDto },
    { status: 400, description: 'Invalid limit or cursor' },
  )
  async list(@Query() query: ListProductsQueryDto): Promise<PaginatedProductListItemDto> {
    const page = await this.listProducts.execute({
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

    return ProductMapper.toPaginatedList(page.items, {
      nextCursor: page.nextCursor,
      prevCursor: page.prevCursor,
      hasMore: page.hasMore,
    });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponses(
    { status: 200, description: 'Product detail', type: ProductDetailDto },
    { status: 404, description: 'Product not found' },
  )
  async get(@Param('id') id: string): Promise<ProductDetailDto> {
    const product = await this.getProduct.execute(id);
    return ProductMapper.toDetail(product);
  }

  @Patch(':id')
  @HttpCode(200)
  @AdminOnly()
  @ApiOperation({ summary: 'Update a product (admin only)' })
  @ApiResponses(
    { status: 200, description: 'Product updated', type: ProductDetailDto },
    { status: 401, description: 'Missing or invalid access token' },
    { status: 403, description: 'Requires admin role' },
    { status: 404, description: 'Product not found' },
  )
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<ProductDetailDto> {
    return ProductMapper.toDetail(await this.updateProduct.execute(id, dto));
  }

  @Patch(':id/stock')
  @HttpCode(200)
  @AdminOnly()
  @ApiOperation({ summary: 'Adjust product stock (admin only)' })
  @ApiResponses(
    { status: 200, description: 'Stock updated', type: ProductDetailDto },
    { status: 400, description: 'Insufficient stock' },
    { status: 401, description: 'Missing or invalid access token' },
    { status: 403, description: 'Requires admin role' },
    { status: 404, description: 'Product not found' },
  )
  async updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto): Promise<ProductDetailDto> {
    return ProductMapper.toDetail(await this.adjustStock.execute(id, dto.delta));
  }

  @Delete(':id')
  @HttpCode(200)
  @AdminOnly()
  @ApiOperation({ summary: 'Delete a product (admin only)' })
  @ApiResponses(
    { status: 200, description: 'Product deleted' },
    { status: 401, description: 'Missing or invalid access token' },
    { status: 403, description: 'Requires admin role' },
    { status: 404, description: 'Product not found' },
  )
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProduct.execute(id);
  }
}
