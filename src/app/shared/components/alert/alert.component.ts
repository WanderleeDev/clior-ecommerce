import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type AlertType = 'error' | 'success' | 'info' | 'warning';

@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  readonly type = input<AlertType>('info');
  readonly title = input<string>('Something went wrong');
  readonly messages = input.required<string[] | string>();
}
