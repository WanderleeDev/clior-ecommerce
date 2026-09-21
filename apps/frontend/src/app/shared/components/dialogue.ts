import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';

@Component({
  selector: 'app-dialogue',
  standalone: true,
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mx-auto max-w-4xl space-y-4 px-4 py-10 sm:px-6">
      <div class="flex items-end gap-3">
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface"
        >
          <ngx-iconify icon="noto:dog-face" [size]="30" />
        </span>
        <p
          class="max-w-[80%] rounded-2xl rounded-bl-md border border-line bg-surface px-5 py-3 font-display text-xl font-bold md:text-2xl"
        >
          {{ question() }}
        </p>
      </div>
      <div class="flex items-end justify-end gap-3">
        <p
          class="max-w-[80%] rounded-2xl rounded-br-md bg-accent px-5 py-3 text-lg text-white"
        >
          {{ answer() }}
        </p>
        <span
          class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-surface"
        >
          <ngx-iconify icon="noto:dog" [size]="30" />
        </span>
      </div>
    </div>
  `,
})
export class Dialogue {
  readonly question = input.required<string>();
  readonly answer = input.required<string>();
}
