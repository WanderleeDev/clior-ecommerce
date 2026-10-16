import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProductController } from '../../../infrastructure/adapters/in/http/product.controller';
import { AUTH_ROLES_KEY } from '../../../../../modules/auth/infrastructure/adapters/in/http/roles.decorator';
import { IS_PUBLIC_KEY } from '../../../../../shared/infrastructure/http/public.decorator';
import { ListProductsUseCase } from '../list-products.use-case';
import { CreateProductUseCase } from '../create-product.use-case';
import { GetProductUseCase } from '../get-product.use-case';
import { DeleteProductUseCase, UpdateProductUseCase, UpdateStockUseCase } from '../manage-products.use-case';
import { ProductNotFoundError } from '../../../domain/errors/product.errors';
import { ProductRepositoryPort } from '../../ports/out/product-repository.port';
import { ListProductsPort } from '../../ports/in/list-products.port';
import { GetProductPort } from '../../ports/in/get-product.port';
import { CreateProductPort } from '../../ports/in/create-product.port';
import { DeleteProductPort, UpdateProductPort, UpdateStockPort } from '../../ports/in/manage-products.port';
import { InMemoryProductRepository } from '../../../infrastructure/adapters/out/persistence/in-memory-product.repository';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductRepositoryPort, useClass: InMemoryProductRepository },
        { provide: ListProductsPort, useClass: ListProductsUseCase },
        { provide: GetProductPort, useClass: GetProductUseCase },
        { provide: CreateProductPort, useClass: CreateProductUseCase },
        { provide: UpdateProductPort, useClass: UpdateProductUseCase },
        { provide: UpdateStockPort, useClass: UpdateStockUseCase },
        { provide: DeleteProductPort, useClass: DeleteProductUseCase },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('lists first page with nextCursor', async () => {
    const result = await controller.list({ limit: 1, sort: 'newest' });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe('p1');
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
    expect(result.prevCursor).toBeNull();
  });

  it('returns second page with cursor and prevCursor echo', async () => {
    const first = await controller.list({ limit: 1, sort: 'newest' });
    expect(first.hasMore).toBe(false);
    expect(first.nextCursor).toBeNull();
  });

  it('rejects tampered cursor', async () => {
    await expect(controller.list({ cursor: 'not-a-cursor', sort: 'newest' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('creates a product and returns 201 payload', async () => {
    const created = await controller.create({
      name: 'Clior Croquetas premium 3kg',
      description: 'Alimento balanceado marca de la casa',
      priceCents: 8990,
      brandId: 'brand-clior',
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe('Clior Croquetas premium 3kg');

    const fetched = await controller.get(created.id);
    expect(fetched.priceCents).toBe(8990);
  });

  it('updates a product price and stock', async () => {
    const updated = await controller.update('p1', { priceCents: 2999, stock: 10 });

    expect(updated.priceCents).toBe(2999);
    expect(updated.stock).toBe(10);
  });

  it('adjusts stock with delta', async () => {
    await controller.update('p1', { stock: 10 });
    const updated = await controller.updateStock('p1', { delta: -3 });

    expect(updated.stock).toBe(7);
  });

  it('rejects stock adjustment below zero', async () => {
    await controller.update('p1', { stock: 1 });

    await expect(controller.updateStock('p1', { delta: -5 })).rejects.toThrow(BadRequestException);
  });

  it('deletes a product', async () => {
    await controller.remove('p1');

    await expect(controller.get('p1')).rejects.toThrow(ProductNotFoundError);
  });

  it('gets a product by id', async () => {
    const result = await controller.get('p1');
    expect(result.name).toBe('Sample product');
  });

  it('throws ProductNotFoundError for unknown id', async () => {
    await expect(controller.get('missing')).rejects.toThrow(ProductNotFoundError);
  });
});

describe('ProductController route protection', () => {
  // Mirrors how JwtAuthGuard (APP_GUARD) resolves @Public and how
  // RolesGuard resolves @Roles: handler metadata first, class metadata second.
  const reflector = new Reflector();

  const isPublic = (handler: Function): boolean | undefined =>
    reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [handler, ProductController]);

  it('does not mark the controller class as public', () => {
    // H5(b): a class-level @Public() short-circuits the JwtAuthGuard APP_GUARD,
    // so request.user stays undefined and every admin mutation answers 403.
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, ProductController)).toBeUndefined();
  });

  it('keeps the catalogue reads public', () => {
    expect(isPublic(ProductController.prototype.list)).toBe(true);
    expect(isPublic(ProductController.prototype.get)).toBe(true);
  });

  it('requires authentication and the admin role for every mutation', () => {
    const mutations = ['create', 'update', 'updateStock', 'remove'] as const;

    for (const name of mutations) {
      const handler = ProductController.prototype[name];
      expect(isPublic(handler)).toBeFalsy();
      expect(reflector.getAllAndOverride(AUTH_ROLES_KEY, [handler, ProductController])).toEqual(['admin']);
    }
  });
});
