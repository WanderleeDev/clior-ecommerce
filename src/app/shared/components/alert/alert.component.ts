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

  protected readonly baseStyles = {
    container:
      'flex mb-4 text-sm rounded-lg dark:bg-gray-800 mx-auto max-w-sm sm:max-w-md p-8 my-6 ring-4',
    icon: 'flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]',
    title: 'font-medium',
    messages: 'mt-1.5 list-disc list-inside',
  };

  protected readonly variantStyles = {
    success: 'text-green-800 ring-green-500/50 bg-green-50',
    info: 'text-blue-800 ring-blue-500/50 bg-blue-50',
    warning: 'text-yellow-800 ring-yellow-500/50 bg-yellow-50',
    error: 'text-red-800 ring-red-500/50 bg-red-50',
  };
}
