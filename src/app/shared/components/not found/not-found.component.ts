import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  template: `
    <div
      class="flex flex-col items-center justify-center min-h-[400px] px-4 py-8"
    >
      <div
        class="max-w-2xl w-full text-center flex flex-col items-center gap-2"
      >
        <img
          src="assets/not-found.webp"
          alt="No encontrado"
          fill
          class="object-contain"
        />

        <h2
          class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100"
        >
          {{ message() }}
        </h2>

        <p class="text-gray-600 dark:text-gray-400 text-lg mb-6">
          We're sorry, we couldn't find what you were looking for.
        </p>

        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  message = input<string>('Oops! Resource not found');
}
