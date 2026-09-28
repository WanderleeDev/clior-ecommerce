import type { Product } from '../../../../domain/models/product';
import type {
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from '../../../../application/types/product.types';
import type {
  CreateProductDto,
  ListProductsQueryDto,
  PaginatedProductListItemDto,
  ProductDetailDto,
  ProductListItemDto,
  UpdateProductDto,
} from './product.dto';

export class ProductMapper {
  private constructor() {
    throw new Error('ProductMapper is a static utility class');
  }

  // --- Inbound: HTTP DTO -> application input ---------------------------
  // Projected field by field so a transport-only addition to the DTO stays
  // out of the application instead of crossing on structural compatibility.

  static toCreateCommand(dto: CreateProductDto): CreateProductInput {
    return {
      name: dto.name,
      description: dto.description,
      priceCents: dto.priceCents,
      imageUrl: dto.imageUrl,
      categoryId: dto.categoryId,
      brandId: dto.brandId,
      stock: dto.stock,
    };
  }

  static toUpdateCommand(dto: UpdateProductDto): UpdateProductInput {
    return {
      name: dto.name,
      description: dto.description,
      priceCents: dto.priceCents,
      imageUrl: dto.imageUrl,
      categoryId: dto.categoryId,
      brandId: dto.brandId,
      stock: dto.stock,
    };
  }

  static toListQuery(dto: ListProductsQueryDto): ListProductsQuery {
    return {
      limit: dto.limit ?? 20,
      cursor: dto.cursor,
      categoryId: dto.categoryId,
      brandId: dto.brandId,
      search: dto.search,
      minPrice: dto.minPrice,
      maxPrice: dto.maxPrice,
      inStock: dto.inStock,
      sort: dto.sort ?? 'newest',
    };
  }

  // --- Outbound: domain -> HTTP DTO --------------------------------------

  // The card view. stock stays a number here on purpose: the catalog already
  // exposes an inStock filter, so the exact count is useful to the buyer and
  // the product page is a public route that anyone can read.
  static toListItem(product: Product): ProductListItemDto {
    return {
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
      stock: product.stock,
    };
  }

  static toDetail(product: Product): ProductDetailDto {
    return {
      ...ProductMapper.toListItem(product),
      description: product.description,
      categoryId: product.categoryId,
      brandId: product.brandId,
      createdAt: product.createdAt,
    };
  }

  static toPaginatedList(
    items: Product[],
    pagination: { nextCursor: string | null; prevCursor: string | null; hasMore: boolean },
  ): PaginatedProductListItemDto {
    return {
      items: items.map((product) => ProductMapper.toListItem(product)),
      nextCursor: pagination.nextCursor,
      prevCursor: pagination.prevCursor,
      hasMore: pagination.hasMore,
    };
  }
}
