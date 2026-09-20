import { inject, Component, ChangeDetectionStrategy } from '@angular/core';
import { NgxIconify } from 'ngx-iconify-stack';
import { ThemeSelectService } from 'ngx-theme-stack';

@Component({
  selector: 'app-theme-select',
  standalone: true,
  imports: [NgxIconify],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (theme.isHydrated()) {
      <details class="theme-menu">
        <summary
          aria-label="Elegir tema"
          class="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-line text-foreground hover:border-accent [&::-webkit-details-marker]:hidden"
        >
          <ngx-iconify [icon]="icon(selected())" [size]="20" />
        </summary>
        <div class="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-2xl border border-line bg-background shadow-xl">
          @for (t of options; track t.value) {
            <button
              type="button"
              (click)="theme.select(t.value)"
              [attr.aria-current]="selected() === t.value"
              class="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface aria-[current=true]:bg-surface aria-[current=true]:font-bold"
            >
              <ngx-iconify [icon]="t.icon" [size]="18" />
              <span>{{ t.label }}</span>
              @if (selected() === t.value) {
                <ngx-iconify icon="lucide:check" [size]="16" class="ml-auto text-accent" />
              }
            </button>
          }
        </div>
      </details>
    } @else {
      <div
        style="width: 40px; height: 40px; border-radius: 9999px; background: var(--surface);"
      ></div>
    }
  `,
  styles: `
    .theme-menu { position: relative; }
    .theme-menu[open] > summary { border-color: var(--accent); }
    .theme-menu > div { animation: theme-in 120ms ease-out; }
    @keyframes theme-in {
      from { opacity: 0; translate: 0 -4px; }
      to { opacity: 1; translate: 0 0; }
    }
    @media (prefers-reduced-motion: reduce) {
      .theme-menu > div { animation: none; }
    }
  `,
})
export class ThemeSelect {
  protected readonly theme = inject(ThemeSelectService);

  protected readonly options = [
    { value: 'system', label: 'Sistema', icon: 'lucide:monitor' },
    { value: 'light', label: 'Claro', icon: 'lucide:sun' },
    { value: 'dark', label: 'Oscuro', icon: 'lucide:moon' },
    { value: 'mascotas', label: 'Mascotas', icon: 'noto:paw-prints' },
  ] as const;

  protected selected(): string {
    return this.theme.selectedTheme();
  }

  protected icon(value: string): string {
    return this.options.find((o) => o.value === value)?.icon ?? 'lucide:monitor';
  }
}
