import { Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../../../../application/ports/out/product-repository.port';
import type { CreateProductInput, ListProductsQuery, Page, UpdateProductInput } from '../../../../application/types/product.types';
import type { Product } from '../../../../domain/models/product';
import { decodeCursor, encodeCursor, filtersHash } from '../../../../application/services/product-cursor';

type StoredProduct = Product;

@Injectable()
export class InMemoryProductRepository implements ProductRepositoryPort {
  private readonly products: StoredProduct[] = [
    {
      id: 'p1',
      name: 'Sample product',
      description: 'A sample product',
      priceCents: 1999,
      stock: 5,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    },
  ];

  async findPage(query: ListProductsQuery): Promise<Page<Product>> {
    const hash = filtersHash(query);
    const filtered = this.products.filter((p) => this.matches(p, query));
    const sorted = [...filtered].sort((a, b) => this.compare(a, b, query.sort));

    let start = 0;
    if (query.cursor) {
      const decoded = decodeCursor(query.cursor, query);
      const index = sorted.findIndex(
        (p) => p.id === decoded.id && p.createdAt.toISOString() === decoded.createdAt,
      );
      if (index === -1) {
        return { items: [], nextCursor: null, prevCursor: query.cursor, hasMore: false };
      }
      start = index + 1;
    }

    const slice = sorted.slice(start, start + query.limit + 1);
    const hasMore = slice.length > query.limit;
    const items = hasMore ? slice.slice(0, query.limit) : slice;
    const last = items[items.length - 1];

    return {
      items,
      nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, id: last.id, sort: query.sort, filtersHash: hash }) : null,
      prevCursor: query.cursor ?? null,
      hasMore,
    };
  }

  async findOne(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) ?? null;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product: Product = {
      id: `p-${this.products.length + 1}`,
      stock: 0,
      createdAt: new Date(),
      ...input,
    };
    this.products.push(product);
    return product;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const product = this.products.find((p) => p.id === id);
    if (!product) return null;
    Object.assign(product, input);
    return product;
  }

  async remove(id: string): Promise<boolean> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }

  private matches(p: StoredProduct, query: ListProductsQuery): boolean {
    if (query.minPrice !== undefined && p.priceCents < query.minPrice) return false;
    if (query.maxPrice !== undefined && p.priceCents > query.maxPrice) return false;
    if (query.search) {
      const needle = query.search.toLowerCase();
      if (!p.name.toLowerCase().includes(needle) && !p.description.toLowerCase().includes(needle)) return false;
    }
    return true;
  }

  private compare(a: StoredProduct, b: StoredProduct, sort: ListProductsQuery['sort']): number {
    switch (sort) {
      case 'price_asc':
        return a.priceCents - b.priceCents || (a.id < b.id ? -1 : 1);
      case 'price_desc':
        return b.priceCents - a.priceCents || (a.id < b.id ? -1 : 1);
      case 'newest':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime() || (a.id < b.id ? -1 : 1);
    }
  }
}
