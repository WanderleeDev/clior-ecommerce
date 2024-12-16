import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-last-orders',
  standalone: true,
  imports: [],
  templateUrl: './last-orders.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LastOrdersComponent { }
