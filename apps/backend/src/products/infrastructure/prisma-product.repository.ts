import { Injectable, Inject } from '@nestjs/common';
import { Product, ProductRepositoryPort } from '../domain/product';
import { PRISMA_CLIENT, PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaProductRepository implements ProductRepositoryPort {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      priceCents: p.priceCents,
      imageUrl: p.imageUrl ?? undefined,
    }));
  }

  async findOne(id: string): Promise<Product | undefined> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) return undefined;
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl ?? undefined,
    };
  }
}
