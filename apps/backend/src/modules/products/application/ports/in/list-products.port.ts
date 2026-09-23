import type { ListProductsQuery, PaginatedProducts } from '../../types/product.types';

export abstract class ListProductsPort {
  abstract execute(query: ListProductsQuery): Promise<PaginatedProducts>;
}
