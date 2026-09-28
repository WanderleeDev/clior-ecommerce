import { createHash } from 'node:crypto';
import type { ListProductsQuery, ProductSort } from '../types/product.types';
import { BadRequestException } from '@nestjs/common';

interface DecodedCursor {
  createdAt: string;
  id: string;
  sort: ProductSort;
  filtersHash: string;
}

export function filtersHash(query: Partial<Pick<ListProductsQuery, 'categoryId' | 'brandId' | 'search' | 'minPrice' | 'maxPrice' | 'inStock'>>): string {
  return createHash('sha256')
    .update(JSON.stringify([query.categoryId ?? null, query.brandId ?? null, query.search ?? null, query.minPrice ?? null, query.maxPrice ?? null, query.inStock ?? null]))
    .digest('hex')
    .slice(0, 16);
}

export function encodeCursor(input: { createdAt: Date; id: string; sort: ProductSort; filtersHash: string }): string {
  return Buffer.from(
    JSON.stringify({ createdAt: input.createdAt.toISOString(), id: input.id, sort: input.sort, filtersHash: input.filtersHash }),
  ).toString('base64url');
}

export function decodeCursor(raw: string, query: Partial<Pick<ListProductsQuery, 'sort' | 'categoryId' | 'brandId' | 'search' | 'minPrice' | 'maxPrice' | 'inStock'>>): DecodedCursor {
  let parsed: DecodedCursor;
  try {
    parsed = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')) as DecodedCursor;
  } catch {
    throw new BadRequestException('Invalid cursor');
  }
  if (!parsed || typeof parsed.id !== 'string' || typeof parsed.createdAt !== 'string' || Number.isNaN(Date.parse(parsed.createdAt))) {
    throw new BadRequestException('Invalid cursor');
  }
  if (parsed.sort !== query.sort || parsed.filtersHash !== filtersHash(query)) {
    throw new BadRequestException('Cursor does not match current filters or sort');
  }
  return parsed;
}
