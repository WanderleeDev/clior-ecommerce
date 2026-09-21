import type { Observable } from 'rxjs';
import type { ProductListView, ProductView } from '../../../application/product-view.model';
import type { Review } from '../../models/product.model';

export abstract class ViewProductsUsecase {
  abstract view(id: string): Observable<ProductView>;
  abstract list(): Observable<ProductListView>;
  abstract reviews(id: string): Observable<Review[]>;
}
