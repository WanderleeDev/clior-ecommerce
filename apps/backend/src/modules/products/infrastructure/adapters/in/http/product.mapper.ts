import type { Product } from '../../../../domain/models/product';
import type { PaginatedProductListItemDto, ProductDetailDto, ProductListItemDto } from './product.dto';

export class ProductMapper {
  private constructor() {
    throw new Error('ProductMapper is a static utility class');
  }

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
