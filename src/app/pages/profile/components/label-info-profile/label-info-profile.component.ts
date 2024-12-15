import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-label-info-profile',
  standalone: true,
  templateUrl: './label-info-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelInfoProfileComponent {
  readonly label = input.required<string>();
}
