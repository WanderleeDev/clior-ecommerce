import { Injectable } from '@nestjs/common';
import { ProductRepositoryPort } from '../../../../application/ports/out/product-repository.port';
import type { CreateProductInput, ListProductsQuery, Page, UpdateProductInput } from '../../../../application/types/product.types';
import type { Product } from '../../../../domain/models/product';
import { PrismaService } from '../../../../../../prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { decodeCursor, encodeCursor, filtersHash } from '../../../../application/services/product-cursor';

@Injectable()
export class PrismaProductRepository implements ProductRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  // The catalog listing renders a card, not a detail view: it never needs the
  // long description. detailSelect adds exactly what only the detail view uses,
  // so a new column stays out of both responses until it is listed on purpose.
  private static readonly listSelect = {
    id: true,
    name: true,
    priceCents: true,
    imageUrl: true,
    stock: true,
    createdAt: true,
  } as const;

  private static readonly detailSelect = {
    ...PrismaProductRepository.listSelect,
    description: true,
    categoryId: true,
    brandId: true,
  } as const;

  async findPage(query: ListProductsQuery): Promise<Page<Product>> {
    const hash = filtersHash(query);
    const where: Prisma.ProductWhereInput = {};
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.brandId) where.brandId = query.brandId;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.priceCents = {
        ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
      };
    }
    if (query.inStock) where.stock = { gt: 0 };

    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      query.sort === 'price_asc'
        ? [{ priceCents: 'asc' }, { id: 'desc' }]
        : query.sort === 'price_desc'
          ? [{ priceCents: 'desc' }, { id: 'desc' }]
          : [{ createdAt: 'desc' }, { id: 'desc' }];

    let cursor: Prisma.ProductWhereUniqueInput | undefined;
    if (query.cursor) {
      const decoded = decodeCursor(query.cursor, query);
      cursor = { id: decoded.id };
    }

    const rows = await this.prisma.product.findMany({
      where,
      orderBy,
      select: PrismaProductRepository.listSelect,
      ...(cursor ? { cursor, skip: 1 } : {}),
      take: query.limit + 1,
    });

    const hasMore = rows.length > query.limit;
    const items = (hasMore ? rows.slice(0, query.limit) : rows).map((p) => this.toListDomain(p));
    const last = items[items.length - 1];

    return {
      items,
      nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, id: last.id, sort: query.sort, filtersHash: hash }) : null,
      prevCursor: query.cursor ?? null,
      hasMore,
    };
  }

  async findOne(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: PrismaProductRepository.detailSelect,
    });
    if (!product) return null;
    return this.toDomain(product);
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product = await this.prisma.product.create({ data: input });
    return this.toDomain(product);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    try {
      const product = await this.prisma.product.update({ where: { id }, data: input });
      return this.toDomain(product);
    } catch {
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.prisma.product.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(
    p: {
      id: string;
      name: string;
      description: string;
      priceCents: number;
      imageUrl: string | null;
      categoryId: string | null;
      brandId: string | null;
      stock: number;
      createdAt: Date;
    },
  ): Product {
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      priceCents: p.priceCents,
      imageUrl: p.imageUrl ?? undefined,
      categoryId: p.categoryId ?? undefined,
      brandId: p.brandId ?? undefined,
      stock: p.stock,
      createdAt: p.createdAt,
    };
  }

  // The listing does not load description/categoryId/brandId, so it cannot use
  // toDomain. The domain model still requires them; the listing view never reads
  // them and ProductMapper drops them from the response, so they are empty here
  // rather than fetched once per row.
  private toListDomain(p: {
    id: string;
    name: string;
    priceCents: number;
    imageUrl: string | null;
    stock: number;
    createdAt: Date;
  }): Product {
    return {
      id: p.id,
      name: p.name,
      description: '',
      priceCents: p.priceCents,
      imageUrl: p.imageUrl ?? undefined,
      stock: p.stock,
      createdAt: p.createdAt,
    };
  }
}
