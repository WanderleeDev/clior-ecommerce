import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-store-front',
    imports: [RouterLink],
    templateUrl: './store-front.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'contents',
    }
})
export class StoreFrontComponent {
  protected readonly links = [
    {
      label: 'View products',
      url: '/products',
    },
    {
      label: 'Upcoming releases',
      url: '/releases',
    },
  ];
}
