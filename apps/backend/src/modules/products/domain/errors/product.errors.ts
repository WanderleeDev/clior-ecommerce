export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product ${id} not found`);
    this.name = 'ProductNotFoundError';
  }
}
