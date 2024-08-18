import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ImageSkeletonComponent } from './image-skeleton.component';

@Component({
  selector: 'app-grid-image-skeleton',
  standalone: true,
  imports: [ImageSkeletonComponent],
  template: `
    <div
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 bg-white dark:bg-gray-900 mb-4"
    >
      @for (image of listImages(); track $index) {
      <app-image-skeleton />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridImageSkeletonComponent {
  listImages = input.required<string[], number>({
    transform: (n) => Array<string>(n).fill(''),
  });
}
