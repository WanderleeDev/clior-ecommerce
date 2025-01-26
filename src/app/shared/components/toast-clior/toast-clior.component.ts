import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-toast-clior',
  imports: [],
  template: `
    <figure
      class="flex gap-3 items-center p-4 rounded-lg sm:min-w-96 w-full bg-blue-950 border-blue-500 border-[1px] shadow-md shadow-blue-800 sm:-translate-x-2"
    >
      <figcaption
        class="self-center text-3xl font-semibold whitespace-nowrap text-white block border-t-2 border-b-2 uppercase tracking-widest"
      >
        Clior
      </figcaption>
      >
      <p class="text-white text-sm font-medium md:text-lg">
        {{ message() }}
      </p>
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastCliorComponent {
  message = input.required<string>();
}
