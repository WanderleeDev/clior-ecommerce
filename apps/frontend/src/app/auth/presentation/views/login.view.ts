import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, email, form, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { SectionTag } from '../../../shared/components/section-tag';
import { AuthUsecase } from '../../domain/ports/in/auth.usecase';
import { AuthStore } from '../state/auth.store';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [FormField, RouterLink, SectionTag],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mx-auto max-w-md px-4 py-10 sm:px-6">
      <app-section-tag label="Mi cuenta" />
      <h1 class="mt-3 font-display text-3xl font-extrabold md:text-4xl">
        Inicia <span class="text-muted">sesión.</span>
      </h1>
      <p class="mt-3 text-muted">
        Bienvenido de vuelta. Tu peludo te extrañó.
      </p>

      <form
        class="mt-8 space-y-4"
        aria-label="Formulario de inicio de sesión"
        (submit)="onSubmit($event)"
      >
        <div>
          <label for="login-email" class="text-sm font-medium">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="tu@correo.com"
            autocomplete="email"
            [formField]="loginForm.email"
            class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          @if (loginForm.email().touched() && loginForm.email().invalid()) {
            <p class="mt-1 text-sm text-red-500">
              @for (e of loginForm.email().errors(); track $index) {
                {{ e.message }}
              }
            </p>
          }
        </div>
        <div>
          <label for="login-password" class="text-sm font-medium">Contraseña</label>
          <input
            id="login-password"
            type="password"
            placeholder="Tu contraseña"
            autocomplete="current-password"
            [formField]="loginForm.password"
            class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          @if (loginForm.password().touched() && loginForm.password().invalid()) {
            <p class="mt-1 text-sm text-red-500">
              @for (e of loginForm.password().errors(); track $index) {
                {{ e.message }}
              }
            </p>
          }
        </div>
        @if (error()) {
          <p class="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {{ error() }}
          </p>
        }
        <button
          type="submit"
          [disabled]="submitting()"
          class="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 font-bold text-accent-ink disabled:opacity-50"
        >
          {{ submitting() ? 'Ingresando…' : 'Ingresar' }}
        </button>
      </form>

      <div class="mt-6 space-y-2 text-center text-sm">
        <p>
          <a routerLink="/recuperar" class="text-accent hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </p>
        <p class="text-muted">
          ¿Aún no tienes cuenta?
          <a routerLink="/registro" class="font-medium text-accent hover:underline">
            Regístrate gratis
          </a>
        </p>
      </div>
    </section>
  `,
})
export class LoginView {
  private readonly auth = inject(AuthUsecase);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly model = signal({ email: '', password: '' });
  protected readonly loginForm = form(this.model, (f) => {
    required(f.email, { message: 'El email es obligatorio' });
    email(f.email, { message: 'Ingresa un email válido' });
    required(f.password, { message: 'La contraseña es obligatoria' });
  });

  protected readonly error = signal<string | null>(null);
  protected readonly submitting = signal(false);

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set(null);
    this.submitting.set(true);
    try {
      const ok = await submit(this.loginForm, async () => {
        await new Promise<Parameters<typeof this.store.set>[0]>(
          (resolve, reject) => {
            this.auth.login(this.model()).subscribe({ next: resolve, error: reject });
          },
        ).then((user) => this.store.set(user));
      });
      if (ok) {
        await this.router.navigate(['/cuenta']);
      } else {
        this.error.set('Revisa los campos marcados.');
      }
    } catch {
      this.error.set('No pudimos iniciar sesión. Intenta de nuevo.');
    } finally {
      this.submitting.set(false);
    }
  }
}
