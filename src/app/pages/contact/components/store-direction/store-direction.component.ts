import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Store } from '../../interfaces/Store.interface';

@Component({
  selector: 'app-store-direction',
  standalone: true,
  imports: [],
  templateUrl: './store-direction.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreDirectionComponent {
  readonly store = input.required<Store>()
}
