import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/adapters/in/http/product.controller';
import {
  GetProductUseCase,
  ListProductsUseCase,
} from './application/products.use-cases';
import { ProductRepositoryPort } from './domain/product';
import { PrismaProductRepository } from './infrastructure/adapters/out/persistence/prisma-product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    { provide: ProductRepositoryPort, useClass: PrismaProductRepository },
    ListProductsUseCase,
    GetProductUseCase,
  ],
})
export class ProductModule {}
