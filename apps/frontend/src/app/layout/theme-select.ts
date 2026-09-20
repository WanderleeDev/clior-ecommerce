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
      <select
        class="theme-select"
        name="select-theme"
        aria-label="Elegir tema"
        [value]="selected()"
        (change)="onThemeChange($event)"
      >
        <button>
          <selectedcontent></selectedcontent>
        </button>
        @for (t of options; track t.value) {
          <option [value]="t.value">
            <ngx-iconify class="opt-icon" [icon]="t.icon" [size]="18" />
            <span class="opt-label">{{ t.label }}</span>
          </option>
        }
      </select>
    } @else {
      <div
        style="width: 40px; height: 40px; border-radius: 9999px; background: var(--surface);"
      ></div>
    }
  `,
  styles: `
    .theme-select,
    .theme-select::picker(select) {
      appearance: base-select;
    }

    .theme-select {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      height: 2.5rem;
      min-width: 2.5rem;
      max-width: 11rem;
      padding-inline: 0.625rem;
      border: 1px solid var(--line);
      border-radius: 9999px;
      background: var(--background);
      color: var(--foreground);
      font-size: 0.875rem;
      cursor: pointer;
      field-sizing: content;
    }

    .theme-select:hover,
    .theme-select:focus-visible {
      border-color: var(--accent);
    }

    .theme-select::picker-icon {
      color: var(--muted);
      transition: rotate 160ms ease;
    }

    .theme-select:open::picker-icon {
      rotate: 180deg;
    }

    .theme-select > button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .theme-select selectedcontent {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .theme-select selectedcontent .opt-icon {
      display: inline-flex;
    }

    .theme-select selectedcontent .opt-label {
      display: none;
    }

    @container (min-width: 0) {}

    .theme-select::picker(select) {
      border: 1px solid var(--line);
      border-radius: 1rem;
      background: var(--background);
      box-shadow: 0 12px 32px rgb(0 0 0 / 0.16);
      padding: 0.25rem;
      opacity: 0;
      transition: opacity 160ms ease, display 160ms allow-discrete, overlay 160ms allow-discrete;
    }

    .theme-select:open::picker(select) {
      opacity: 1;
    }

    @starting-style {
      .theme-select:open::picker(select) {
        opacity: 0;
      }
    }

    .theme-select option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.875rem;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      color: var(--foreground);
    }

    .theme-select option:hover,
    .theme-select option:focus-visible {
      background: var(--surface);
    }

    .theme-select option:checked {
      font-weight: 700;
      background: var(--surface);
    }

    .theme-select option::checkmark {
      order: 1;
      margin-inline-start: auto;
      color: var(--accent);
    }

    @supports not (appearance: base-select) {
      .theme-select {
        appearance: none;
        padding-inline-end: 2rem;
        background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%),
          linear-gradient(135deg, var(--muted) 50%, transparent 50%);
        background-position: calc(100% - 1rem) 50%, calc(100% - 0.7rem) 50%;
        background-size: 0.3rem 0.3rem;
        background-repeat: no-repeat;
      }
      .theme-select selectedcontent,
      .theme-select > button {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .theme-select,
      .theme-select::picker(select),
      .theme-select::picker-icon {
        transition: none;
      }
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

  protected onThemeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.theme.select(value);
  }
}
