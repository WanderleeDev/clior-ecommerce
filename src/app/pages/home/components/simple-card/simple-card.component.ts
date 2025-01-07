import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '../../interface/SimpleCard.interface';

@Component({
  selector: 'app-simple-card',
  imports: [],
  templateUrl: './simple-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleCardComponent {
  card = input.required<Card>();
}
