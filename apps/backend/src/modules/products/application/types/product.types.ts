import type { Product } from '../../domain/models/product';

export type ProductSort = 'newest' | 'price_asc' | 'price_desc';

export interface ListProductsQuery {
  limit: number;
  cursor?: string;
  categoryId?: string;
  brandId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort: ProductSort;
}

export interface CreateProductInput {
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
  categoryId?: string;
  brandId?: string;
  stock?: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  priceCents?: number;
  imageUrl?: string;
  categoryId?: string;
  brandId?: string;
  stock?: number;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
  prevCursor: string | null;
  hasMore: boolean;
}

export type PaginatedProducts = Page<Product>;
