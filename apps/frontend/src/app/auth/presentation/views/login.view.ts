import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormField, email, form, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { SectionTag } from '../../../shared/components/section-tag';
import { AuthError } from '../../domain/errors/auth.error';
import { AuthUsecase } from '../../domain/ports/in/auth.usecase';
import { AuthShell } from '../components/auth-shell';
import { AuthStore } from '../state/auth.store';
import { createResendCooldown } from '../state/resend-cooldown';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [FormField, RouterLink, SectionTag, AuthShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-shell image="/banner-blog.png" imageAlt="Perro golden y gato atigrado descansando juntos sobre el pasto">
      <app-section-tag label="Mi cuenta" />
      <h1 class="mt-3 font-display text-3xl font-extrabold md:text-4xl">
        Inicia <span class="text-muted">sesión.</span>
      </h1>
      <p class="mt-3 text-muted">Bienvenido de vuelta. Tu peludo te extrañó.</p>

      <form
        class="mt-8 space-y-4"
        aria-label="Formulario de inicio de sesión"
        novalidate
        [attr.aria-busy]="submitting()"
        (submit)="onSubmit($event)"
      >
        <fieldset class="contents space-y-4" [disabled]="submitting()">
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
              <p class="mt-1 text-sm text-red-500" aria-live="polite">
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
              <p class="mt-1 text-sm text-red-500" aria-live="polite">
                @for (e of loginForm.password().errors(); track $index) {
                  {{ e.message }}
                }
              </p>
            }
          </div>
          @if (error()) {
            <p role="alert" class="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {{ error() }}
              @if (unverified()) {
                <button
                  type="button"
                  (click)="onResend()"
                  [disabled]="resendBusy() || cooldown() > 0"
                  class="ml-1 font-medium underline disabled:opacity-60"
                >
                  {{ resendLabel() }}
                </button>
              }
            </p>
          }
          <button
            type="submit"
            [disabled]="submitting()"
            class="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 font-bold text-accent-ink disabled:opacity-50"
          >
            {{ submitting() ? 'Ingresando…' : 'Ingresar' }}
          </button>
        </fieldset>
      </form>

      <div class="mt-6 space-y-2 text-center text-sm">
        <p>
          <a routerLink="/recuperar" class="text-accent hover:underline">¿Olvidaste tu contraseña?</a>
        </p>
        <p class="text-muted">
          ¿Aún no tienes cuenta?
          <a routerLink="/registro" class="font-medium text-accent hover:underline">Regístrate gratis</a>
        </p>
      </div>
    </app-auth-shell>
  `,
})
export class LoginView {
  private readonly auth = inject(AuthUsecase);
  private readonly store = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly cooldownState = createResendCooldown();

  protected readonly model = signal({ email: '', password: '' });
  protected readonly loginForm = form(this.model, (f) => {
    required(f.email, { message: 'El email es obligatorio' });
    email(f.email, { message: 'Ingresa un email válido' });
    required(f.password, { message: 'La contraseña es obligatoria' });
  });

  protected readonly error = signal<string | null>(null);
  protected readonly unverified = signal(false);
  protected readonly submitting = signal(false);
  protected readonly resendBusy = signal(false);
  protected readonly cooldown = this.cooldownState.remaining;
  protected readonly resendLabel = computed(() => {
    if (this.resendBusy()) return 'Reenviando…';
    const seconds = this.cooldown();
    return seconds > 0 ? `Reenviar en ${seconds}s` : 'Reenviar correo';
  });

  constructor() {
    if (this.store.isLoggedIn()) void this.router.navigate(['/cuenta']);
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.submitting()) return;
    this.error.set(null);
    this.unverified.set(false);
    this.submitting.set(true);
    try {
      const ok = await submit(this.loginForm, async () => {
        const user = await new Promise<Parameters<typeof this.store.set>[0]>((resolve, reject) => {
          this.auth.login(this.model()).subscribe({ next: resolve, error: reject });
        });
        this.store.set(user);
      });
      if (ok) {
        await this.router.navigate(['/cuenta']);
      } else {
        this.focusFirstInvalidField();
      }
    } catch (error) {
      this.error.set(
        error instanceof AuthError ? error.message : 'No pudimos iniciar sesión. Intenta de nuevo.',
      );
      this.unverified.set(error instanceof AuthError && error.code === 'unverified');
      this.model.update((m) => ({ ...m, password: '' }));
      this.loginForm.password().reset();
    } finally {
      this.submitting.set(false);
    }
  }

  protected async onResend(): Promise<void> {
    if (this.resendBusy() || this.cooldown() > 0) return;
    this.resendBusy.set(true);
    try {
      await new Promise<void>((resolve, reject) => {
        this.auth.resendVerification(this.model().email.trim()).subscribe({ next: () => resolve(), error: reject });
      });
      this.error.set('Te enviamos un nuevo enlace de verificación. Revisa tu bandeja.');
    } catch (error) {
      this.error.set(
        error instanceof AuthError ? error.message : 'No pudimos reenviar el correo. Intenta de nuevo.',
      );
    } finally {
      this.resendBusy.set(false);
      this.cooldownState.start();
    }
  }

  private focusFirstInvalidField(): void {
    const candidates: ReadonlyArray<{ id: string; invalid: boolean }> = [
      { id: 'login-email', invalid: this.loginForm.email().invalid() },
      { id: 'login-password', invalid: this.loginForm.password().invalid() },
    ];
    const first = candidates.find((candidate) => candidate.invalid);
    if (first) document.getElementById(first.id)?.focus();
  }
}