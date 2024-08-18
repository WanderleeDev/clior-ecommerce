import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  readonly #http = inject(HttpClient);

  public fetchData<T>(endpoint: string): Observable<T> {
    return this.#http.get<T>(endpoint);
  }
}
