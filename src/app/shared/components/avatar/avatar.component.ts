import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage],
  templateUrl: './avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  readonly rounded = input<'full' | 'none' | 'medium'>('full');
  readonly sizeClass = input('size-8');
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
}
