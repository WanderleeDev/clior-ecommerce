import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, email, form, required, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { SectionTag } from '../../../shared/components/section-tag';
import { AuthShell } from '../components/auth-shell';
import { AuthUsecase } from '../../domain/ports/in/auth.usecase';

@Component({
  selector: 'app-recover-view',
  standalone: true,
  imports: [FormField, RouterLink, SectionTag, AuthShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-shell image="/banner-blog.png" imageAlt="Perro golden y gato atigrado descansando juntos sobre el pasto">
      <app-section-tag label="Mi cuenta" />
      <h1 class="mt-3 font-display text-3xl font-extrabold md:text-4xl">
        Recupera <span class="text-muted">tu acceso.</span>
      </h1>
      <p class="mt-3 text-muted">
        Te enviamos un enlace para restablecer tu contraseña.
      </p>

      @if (sent()) {
        <div class="mt-8 rounded-3xl border border-line bg-surface p-8 text-center">
          <p class="font-display text-xl font-bold">Revisa tu correo</p>
          <p class="mt-2 text-sm text-muted">
            Si {{ model().email }} está registrado, recibirás el enlace en unos
            minutos.
          </p>
          <a
            routerLink="/ingresar"
            class="mt-5 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-bold text-accent-ink"
          >
            Volver a ingresar
          </a>
        </div>
      } @else {
        <form
          class="mt-8 space-y-4"
          aria-label="Formulario de recuperación"
          (submit)="onSubmit($event)"
        >
          <div>
            <label for="recover-email" class="text-sm font-medium">Email</label>
            <input
              id="recover-email"
              type="email"
              placeholder="tu@correo.com"
              autocomplete="email"
              [formField]="recoverForm.email"
              class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
            />
            @if (recoverForm.email().touched() && recoverForm.email().invalid()) {
              <p class="mt-1 text-sm text-red-500">
                @for (e of recoverForm.email().errors(); track $index) {
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
            {{ submitting() ? 'Enviando…' : 'Enviar enlace' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-muted">
          ¿Recordaste tu contraseña?
          <a routerLink="/ingresar" class="font-medium text-accent hover:underline">
            Inicia sesión
          </a>
        </p>
      }
    </app-auth-shell>
  `,
})
export class RecoverView {
  private readonly auth = inject(AuthUsecase);

  protected readonly model = signal({ email: '' });
  protected readonly recoverForm = form(this.model, (f) => {
    required(f.email, { message: 'El email es obligatorio' });
    email(f.email, { message: 'Ingresa un email válido' });
  });

  protected readonly error = signal<string | null>(null);
  protected readonly submitting = signal(false);
  protected readonly sent = signal(false);

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set(null);
    this.submitting.set(true);
    try {
      const ok = await submit(this.recoverForm, async () => {
        await new Promise<void>((resolve, reject) => {
          this.auth.recover(this.model()).subscribe({ next: () => resolve(), error: reject });
        });
      });
      if (ok) {
        this.sent.set(true);
      } else {
        this.error.set('Revisa los campos marcados.');
      }
    } catch {
      this.error.set('No pudimos enviar el enlace. Intenta de nuevo.');
    } finally {
      this.submitting.set(false);
    }
  }
}
