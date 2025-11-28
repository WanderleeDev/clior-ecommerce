import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { SpeechRecognitionComponent } from '../../../speech-to-text/components/speech-recognition/speech-recognition.component';
import { SearchSvgComponent } from '../../../../shared/icons/search-svg.component';
import { ProductsService } from '../../services/products.service';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, delay, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  imports: [
    SpeechRecognitionComponent,
    SearchSvgComponent,
    FormsModule,
    LoaderComponent,
    RouterLink,
  ],
  templateUrl: './search-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  readonly productService = inject(ProductsService);
  readonly searchTerm = signal<string>('');
  readonly debouncedTerm = toSignal(
    toObservable(this.searchTerm).pipe(debounceTime(500)),
  );
  readonly productResource = rxResource({
    params: () => this.debouncedTerm(),
    stream: ({ params: term }) => {
      delay(5000);
      if (term === '') return of([]);

      return this.productService.searchProducts(term);
    },
  });

  public onSearchTermChange(searchTerm: string) {
    this.searchTerm.set(searchTerm);
  }
}
