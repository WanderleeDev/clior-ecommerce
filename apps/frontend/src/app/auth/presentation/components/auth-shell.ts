import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-10">
      <div class="grid overflow-hidden rounded-3xl border border-line md:grid-cols-2">
        <div class="flex flex-col justify-center bg-surface p-8 md:p-12 lg:p-14">
          <ng-content />
        </div>
        <div class="relative min-h-64 md:min-h-full">
          <img
            [src]="image()"
            [alt]="imageAlt()"
            loading="eager"
            fetchpriority="high"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  `,
})
export class AuthShell {
  readonly image = input('/banner-blog.png');
  readonly imageAlt = input('Mascotas felices junto a sus dueños');
}
