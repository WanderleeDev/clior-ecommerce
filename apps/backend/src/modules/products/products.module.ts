import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/adapters/in/http/product.controller';
import {
  GetProductUseCase,
  ListProductsUseCase,
} from './application/products.use-cases';
import { PRODUCT_REPOSITORY_PORT } from './domain/product';
import { PrismaProductRepository } from './infrastructure/adapters/out/persistence/prisma-product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY_PORT,
      useClass: PrismaProductRepository,
    },
    ListProductsUseCase,
    GetProductUseCase,
  ],
})
export class ProductModule {}
