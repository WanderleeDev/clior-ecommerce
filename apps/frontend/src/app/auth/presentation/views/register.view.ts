import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, email, form, minLength, required, submit, validate } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { SectionTag } from '../../../shared/components/section-tag';
import { AuthShell } from '../components/auth-shell';
import { AuthUsecase } from '../../domain/ports/in/auth.usecase';

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [FormField, RouterLink, SectionTag, AuthShell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-shell image="/banner-blog.png" imageAlt="Perro golden y gato atigrado descansando juntos sobre el pasto">
      <app-section-tag label="Mi cuenta" />
      <h1 class="mt-3 font-display text-3xl font-extrabold md:text-4xl">
        Crea <span class="text-muted">tu cuenta.</span>
      </h1>
      <p class="mt-3 text-muted">
        Únete a la manada. Envío gratis desde S/ 99.
      </p>

      <form
        class="mt-8 space-y-4"
        aria-label="Formulario de registro"
        (submit)="onSubmit($event)"
      >
        <div>
          <label for="register-name" class="text-sm font-medium">Nombre</label>
          <input
            id="register-name"
            type="text"
            placeholder="Tu nombre"
            autocomplete="name"
            [formField]="registerForm.name"
            class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          @if (registerForm.name().touched() && registerForm.name().invalid()) {
            <p class="mt-1 text-sm text-red-500">
              @for (e of registerForm.name().errors(); track $index) {
                {{ e.message }}
              }
            </p>
          }
        </div>
        <div>
          <label for="register-email" class="text-sm font-medium">Email</label>
          <input
            id="register-email"
            type="email"
            placeholder="tu@correo.com"
            autocomplete="email"
            [formField]="registerForm.email"
            class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          @if (registerForm.email().touched() && registerForm.email().invalid()) {
            <p class="mt-1 text-sm text-red-500">
              @for (e of registerForm.email().errors(); track $index) {
                {{ e.message }}
              }
            </p>
          }
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="register-password" class="text-sm font-medium">Contraseña</label>
            <input
              id="register-password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              autocomplete="new-password"
              [formField]="registerForm.password"
              class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
            />
          </div>
          <div>
            <label for="register-confirm" class="text-sm font-medium">Confirmar</label>
            <input
              id="register-confirm"
              type="password"
              placeholder="Repite tu contraseña"
              autocomplete="new-password"
              [formField]="registerForm.confirmPassword"
              class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
            />
          </div>
        </div>
        @if (
          (registerForm.password().touched() && registerForm.password().invalid()) ||
          (registerForm.confirmPassword().touched() && registerForm().invalid())
        ) {
          <p class="text-sm text-red-500">
            @for (e of registerForm.password().errors(); track $index) {
              {{ e.message }}
            }
            @for (e of registerForm().errors(); track $index) {
              {{ e.message }}
            }
          </p>
        }
        <div>
          <label for="register-pet" class="text-sm font-medium">Tu mascota</label>
          <input
            id="register-pet"
            type="text"
            placeholder="Ej. Rocky · Labrador 3 años"
            [formField]="registerForm.pet"
            class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
        </div>
        @if (error()) {
          <p class="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {{ error() }}
          </p>
        }
        @if (success()) {
          <p class="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
            {{ success() }}
          </p>
        }
        <button
          type="submit"
          [disabled]="submitting()"
          class="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 font-bold text-accent-ink disabled:opacity-50"
        >
          {{ submitting() ? 'Creando cuenta…' : 'Crear cuenta' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-muted">
        ¿Ya tienes cuenta?
        <a routerLink="/ingresar" class="font-medium text-accent hover:underline">
          Inicia sesión
        </a>
      </p>
    </app-auth-shell>
  `,
})
export class RegisterView {
  private readonly auth = inject(AuthUsecase);
  private readonly router = inject(Router);

  protected readonly model = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    pet: '',
  });
  protected readonly registerForm = form(this.model, (f) => {
    required(f.name, { message: 'El nombre es obligatorio' });
    required(f.email, { message: 'El email es obligatorio' });
    email(f.email, { message: 'Ingresa un email válido' });
    required(f.password, { message: 'La contraseña es obligatoria' });
    minLength(f.password, 8, { message: 'Mínimo 8 caracteres' });
    validate(f.confirmPassword, ({ valueOf }) => {
      if (valueOf(f.confirmPassword) !== valueOf(f.password)) {
        return {
          kind: 'mismatch',
          message: 'Las contraseñas no coinciden',
          field: f.confirmPassword,
        };
      }
      return null;
    });
  });

  protected readonly error = signal<string | null>(null);
  protected readonly success = signal<string | null>(null);
  protected readonly submitting = signal(false);

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set(null);
    this.success.set(null);
    this.submitting.set(true);
    try {
      const ok = await submit(this.registerForm, async () => {
        await new Promise<string>((resolve, reject) => {
          this.auth.register(this.model()).subscribe({
            next: (result) => resolve(result.message),
            error: reject,
          });
        }).then((message) => this.success.set(message));
      });
      if (ok) {
        await this.router.navigate(['/ingresar']);
      } else {
        this.error.set('Revisa los campos marcados.');
      }
    } catch {
      this.error.set('No pudimos crear tu cuenta. Intenta de nuevo.');
    } finally {
      this.submitting.set(false);
    }
  }
}
