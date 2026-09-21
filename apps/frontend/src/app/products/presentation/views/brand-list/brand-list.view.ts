import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';

const BRAND_NAMES = [
  'Bark', 'Bravecto', 'Brit Care', 'CanBo', 'Catit', 'Churu', 'Dentastix',
  'Dog Chow', 'Drontal', 'Eukanuba', 'Fancy Feast', 'Felix', 'Ferplast',
  'Fresh Step', 'Friskies', 'Frontline', 'Furminator', 'Greenies', 'Hartz',
  "Hill's", 'Kong', 'LickiMat', 'Meow Mix', 'Mimaskot', 'Naturalis', 'NexGard',
  'Nutrican', 'Pedigree', 'PetCare+', 'Pro Plan', 'Purina One', 'Ricocat',
  'Ricocan', 'Royal Canin', 'Simparica', 'Super Can', 'Super Cat', 'Thor',
  'Tidy Cats', 'Trixie', 'Whiskas', 'Zeedog',
];

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 class="font-display text-3xl font-extrabold md:text-5xl">
        Marcas <span class="text-muted">aliadas.</span>
      </h1>
      <p class="mt-3 max-w-2xl text-muted">
        Trabajamos directo con {{ brands().length }} marcas verificadas. Solo
        originales, con registro sanitario y fecha vigente.
      </p>

      <div class="mt-8 flex flex-wrap gap-2" aria-label="Filtrar por letra">
        @for (letter of letters(); track letter) {
          <button
            type="button"
            (click)="active.set(active() === letter ? null : letter)"
            [attr.aria-pressed]="active() === letter"
            class="flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-colors motion-reduce:transition-none"
            [class.border-accent]="active() === letter"
            [class.bg-accent]="active() === letter"
            [class.text-accent-ink]="active() === letter"
            [class.border-line]="active() !== letter"
          >
            {{ letter }}
          </button>
        }
      </div>

      <div class="mt-10 columns-2 gap-8 sm:columns-3 lg:columns-4">
        @for (brand of filtered(); track brand; let i = $index) {
          <a
            [href]="'/catalogo?marca=' + brand"
            class="mb-8 block break-inside-avoid text-center transition-opacity motion-reduce:transition-none hover:opacity-70"
            [class.text-2xl]="i % 4 === 0"
            [class.md:text-4xl]="i % 4 === 0"
            [class.text-xl]="i % 4 === 1"
            [class.md:text-3xl]="i % 4 === 1"
            [class.text-lg]="i % 4 === 2"
            [class.md:text-2xl]="i % 4 === 2"
            [class.text-base]="i % 4 === 3"
            [class.md:text-xl]="i % 4 === 3"
            [class.font-display]="true"
            [class.font-extrabold]="i % 2 === 0"
            [class.font-bold]="i % 2 !== 0"
            [class.text-muted]="i % 3 === 0"
          >
            {{ brand }}
          </a>
        }
      </div>

      @if (!filtered().length) {
        <div class="mt-4 rounded-2xl border border-line bg-surface p-10 text-center">
          <p class="font-display text-xl font-bold">Sin marcas con “{{ active() }}”</p>
          <button
            type="button"
            (click)="active.set(null)"
            class="mt-4 inline-flex items-center justify-center rounded-full border border-line px-5 py-2.5 text-sm font-bold transition-colors motion-reduce:transition-none hover:border-accent hover:text-accent"
          >
            Ver todas
          </button>
        </div>
      }
    </section>
  `,
})
export class BrandListView {
  protected readonly brands = signal(BRAND_NAMES);
  protected readonly active = signal<string | null>(null);

  protected readonly letters = computed(() =>
    [...new Set(this.brands().map((brand) => brand[0].toUpperCase()))].sort(),
  );

  protected readonly filtered = computed(() => {
    const letter = this.active();
    if (!letter) return this.brands();
    return this.brands().filter((brand) => brand.startsWith(letter));
  });
}
