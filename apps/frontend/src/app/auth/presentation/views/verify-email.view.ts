import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormField, email, form, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SectionTag } from '../../../shared/components/section-tag';
import { AuthShell } from '../components/auth-shell';
import { AuthUsecase } from '../../domain/ports/in/auth.usecase';
import { AuthError } from '../../domain/errors/auth.error';
import { createResendCooldown } from '../state/resend-cooldown';

type VerifyState = 'verifying' | 'verified' | 'failed' | 'missing';

/**
 * Landing screen for the verification link (`/verificar?token=…`).
 *
 * The route is client-rendered on purpose (see `app.routes.server.ts`): the
 * token is single-use, so neither the prerenderer nor the SSR renderer may
 * spend it. Once the call settles the token is dropped from the URL so it
 * cannot travel in a Referer header or stay in the history.
 */
@Component({
  selector: 'app-verify-email-view',
  standalone: true,
  imports: [FormField, NgTemplateOutlet, RouterLink, SectionTag, AuthShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-shell image="/banner-blog.png" imageAlt="Perro golden y gato atigrado descansando juntos sobre el pasto">
      <app-section-tag label="Mi cuenta" />

      @switch (state()) {
        @case ('verifying') {
          <div class="mt-8 rounded-3xl border border-line bg-surface p-8 text-center" role="status">
            <p class="font-display text-xl font-bold">Verificando tu correo…</p>
            <p class="mt-2 text-sm text-muted">Estamos activando tu cuenta. Un segundo.</p>
          </div>
        }
        @case ('verified') {
          <div class="mt-8 rounded-3xl border border-line bg-surface p-8 text-center" role="status">
            <p class="font-display text-xl font-bold">Tu correo está verificado</p>
            <p class="mt-2 text-sm text-muted">
              Ya puedes iniciar sesión y seguir comprando para tu mascota.
            </p>
            <a
              routerLink="/ingresar"
              class="mt-5 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-bold text-accent-ink"
            >
              Iniciar sesión
            </a>
          </div>
        }
        @case ('failed') {
          <h1 class="mt-3 font-display text-3xl font-extrabold md:text-4xl">
            Ese enlace <span class="text-muted">ya no sirve.</span>
          </h1>
          <p class="mt-3 text-muted">{{ error() }}</p>
          <ng-container *ngTemplateOutlet="resendBlock" />
        }
        @case ('missing') {
          <h1 class="mt-3 font-display text-3xl font-extrabold md:text-4xl">
            Este enlace <span class="text-muted">está incompleto.</span>
          </h1>
          <p class="mt-3 text-muted">
            Abre el enlace tal como llegó en el correo o pide uno nuevo.
          </p>
          <ng-container *ngTemplateOutlet="resendBlock" />
        }
      }

      <ng-template #resendBlock>
        <form
          class="mt-8 space-y-4"
          aria-label="Formulario para reenviar la verificación"
          [attr.aria-busy]="resendBusy()"
          (submit)="onResend($event)"
        >
          <div>
            <label for="verify-email" class="text-sm font-medium">Email</label>
            <input
              id="verify-email"
              type="email"
              placeholder="tu@correo.com"
              autocomplete="email"
              [formField]="resendForm.email"
              class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
            />
            @if (resendForm.email().touched() && resendForm.email().invalid()) {
              <p class="mt-1 text-sm text-red-500">
                @for (e of resendForm.email().errors(); track $index) {
                  {{ e.message }}
                }
              </p>
            }
          </div>
          @if (resendError()) {
            <p
              role="alert"
              class="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-600"
            >
              {{ resendError() }}
            </p>
          }
          @if (resendNotice()) {
            <p
              role="status"
              class="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700"
            >
              {{ resendNotice() }}
            </p>
          }
          <button
            type="submit"
            [disabled]="resendBusy() || cooldown() > 0"
            class="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 font-bold text-accent-ink disabled:opacity-50"
          >
            {{ resendLabel() }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-muted">
          ¿Ya tienes tu cuenta activa?
          <a routerLink="/ingresar" class="font-medium text-accent hover:underline">
            Inicia sesión
          </a>
        </p>
      </ng-template>
    </app-auth-shell>
  `,
})
export class VerifyEmailView {
  private readonly auth = inject(AuthUsecase);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cooldownState = createResendCooldown();

  protected readonly state = signal<VerifyState>('verifying');
  protected readonly error = signal<string | null>(null);

  protected readonly resendModel = signal({ email: '' });
  protected readonly resendForm = form(this.resendModel, (f) => {
    required(f.email, { message: 'El email es obligatorio' });
    email(f.email, { message: 'Ingresa un email válido' });
  });
  protected readonly resendBusy = signal(false);
  protected readonly resendError = signal<string | null>(null);
  protected readonly resendNotice = signal<string | null>(null);
  protected readonly cooldown = this.cooldownState.remaining;
  protected readonly resendLabel = computed(() => {
    if (this.resendBusy()) return 'Reenviando…';
    const seconds = this.cooldown();
    return seconds > 0 ? `Reenviar en ${seconds}s` : 'Reenviar correo';
  });

  constructor() {
    const token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';
    if (token.length === 0) {
      this.state.set('missing');
      return;
    }

    this.auth.verifyEmail(token).subscribe({
      next: () => {
        this.state.set('verified');
        this.dropTokenFromUrl();
      },
      error: (error: unknown) => {
        this.error.set(
          error instanceof AuthError
            ? error.message
            : 'No pudimos verificar tu correo. Intenta de nuevo.',
        );
        this.state.set('failed');
        this.dropTokenFromUrl();
      },
    });
  }

  protected async onResend(event: Event): Promise<void> {
    event.preventDefault();
    if (this.resendBusy() || this.cooldown() > 0) return;
    this.resendBusy.set(true);
    this.resendError.set(null);
    this.resendNotice.set(null);
    try {
      const ok = await submit(this.resendForm, async () => {
        await new Promise<void>((resolve, reject) => {
          this.auth.resendVerification(this.resendModel().email).subscribe({
            next: () => resolve(),
            error: reject,
          });
        });
      });
      if (ok) {
        this.resendNotice.set('Si el correo está registrado, te enviamos un nuevo enlace.');
      }
    } catch (error) {
      this.resendError.set(
        error instanceof AuthError ? error.message : 'No pudimos reenviar el correo. Intenta de nuevo.',
      );
    } finally {
      this.resendBusy.set(false);
      this.cooldownState.start();
    }
  }

  /** Keeps the one-time token out of the address bar, history and Referer headers. */
  private dropTokenFromUrl(): void {
    void this.router.navigate([], { queryParams: {}, replaceUrl: true });
  }
}
