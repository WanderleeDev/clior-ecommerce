import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-avatar',
    imports: [NgOptimizedImage],
    templateUrl: './avatar.component.html',
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  readonly rounded = input<'full' | 'none' | 'medium'>('full');
  readonly sizeClass = input('size-8');
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  image =
    'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png';
}
