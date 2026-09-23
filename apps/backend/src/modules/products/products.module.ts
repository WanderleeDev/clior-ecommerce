import { Module } from '@nestjs/common';
import { ProductController } from './infrastructure/adapters/in/http/product.controller';
import { ListProductsPort } from './application/ports/in/list-products.port';
import { GetProductPort } from './application/ports/in/get-product.port';
import { CreateProductPort } from './application/ports/in/create-product.port';
import { DeleteProductPort, UpdateProductPort, UpdateStockPort } from './application/ports/in/manage-products.port';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { DeleteProductUseCase, UpdateProductUseCase, UpdateStockUseCase } from './application/use-cases/manage-products.use-case';
import { ProductRepositoryPort } from './application/ports/out/product-repository.port';
import { PrismaProductRepository } from './infrastructure/adapters/out/persistence/prisma-product.repository';

@Module({
  controllers: [ProductController],
  providers: [
    { provide: ProductRepositoryPort, useClass: PrismaProductRepository },
{ provide: ListProductsPort, useClass: ListProductsUseCase },
    { provide: GetProductPort, useClass: GetProductUseCase },
    { provide: CreateProductPort, useClass: CreateProductUseCase },
    { provide: UpdateProductPort, useClass: UpdateProductUseCase },
    { provide: UpdateStockPort, useClass: UpdateStockUseCase },
    { provide: DeleteProductPort, useClass: DeleteProductUseCase },
  ],
})
export class ProductModule {}
