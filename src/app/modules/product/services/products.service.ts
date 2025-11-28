import { inject, Injectable } from '@angular/core';
import { Product } from '../model/Product.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  readonly #http = inject(HttpClient);

  public getProducts(): Observable<Product[]> {
    return this.#http.get<Product[]>(
      'https://hashbrown-chat.xamperu33.workers.dev/products',
    );
  }

  public searchProducts(searchTerm: string): Observable<Product[]> {
    const queryParams = new HttpParams().set('search', searchTerm);

    return this.#http
      .get<
        Product[]
      >('https://hashbrown-chat.xamperu33.workers.dev/products', { params: queryParams })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  public getProductsResource(): Promise<Product[]> {
    return fetch('https://hashbrown-chat.xamperu33.workers.dev/products').then(
      (res) => {
        if (!res.ok) throw new Error('Network response was not ok');

        return res.json();
      },
    );
  }

  public getProductById(id: string): Promise<Product> {
    return fetch(
      `https://hashbrown-chat.xamperu33.workers.dev/products/${id}`,
    ).then((res) => {
      if (!res.ok) throw new Error('Network response was not ok');

      return res.json();
    });
  }
}
