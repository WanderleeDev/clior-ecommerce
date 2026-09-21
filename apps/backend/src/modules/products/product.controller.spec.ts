import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { ProductController } from './infrastructure/adapters/in/http/product.controller';
import {
  GetProductUseCase,
  ListProductsUseCase,
} from './application/products.use-cases';
import { PRODUCT_REPOSITORY_PORT } from './domain/product';
import { InMemoryProductRepository } from './infrastructure/adapters/out/persistence/in-memory-product.repository';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: PRODUCT_REPOSITORY_PORT,
          useClass: InMemoryProductRepository,
        },
        ListProductsUseCase,
        GetProductUseCase,
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('lists all products', async () => {
    const result = await controller.list();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
  });

  it('gets a product by id', async () => {
    const result = await controller.get('p1');
    expect(result.name).toBe('Sample product');
  });

  it('throws HttpException 404 for unknown id', async () => {
    await expect(controller.get('missing')).rejects.toThrow(HttpException);
  });
});
