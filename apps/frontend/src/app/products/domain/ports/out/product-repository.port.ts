import type { Observable } from 'rxjs';
import type { Product, Review } from '../../models/product.model';

export abstract class ProductRepositoryPort {
  abstract getById(id: string): Observable<Product>;
  abstract getRelated(id: string): Observable<Product[]>;
  abstract getAll(): Observable<Product[]>;
  abstract getByCategory(category: string): Observable<Product[]>;
  abstract getReviews(id: string): Observable<Review[]>;
}
