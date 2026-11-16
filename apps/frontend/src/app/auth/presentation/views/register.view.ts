import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormField, email, form, minLength, required, submit, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { SectionTag } from '../../../shared/components/section-tag';
import { AuthShell } from '../components/auth-shell';
import { AuthUsecase } from '../../domain/ports/in/auth.usecase';
import { AuthError } from '../../domain/errors/auth.error';
import type { PetType, RegisterData } from '../../domain/models/auth.model';
import { createResendCooldown } from '../state/resend-cooldown';

interface RegisterModel {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  petType: PetType | '';
}

/** Dropdown options for `Tu mascota`; the value is what the API stores. */
const PET_OPTIONS: ReadonlyArray<{ value: PetType; label: string }> = [
  { value: 'dog', label: 'Perro' },
  { value: 'cat', label: 'Gato' },
  { value: 'small_pet', label: 'Mascota pequeña' },
];

/**
 * Client-side mirror of the backend `@IsStrongPassword` policy so the form
 * explains the rule before a round trip. Keep both lists in sync.
 */
const PASSWORD_RULES: ReadonlyArray<{ test: RegExp; message: string }> = [
  { test: /[a-z]/, message: 'Debe incluir al menos una minúscula' },
  { test: /[A-Z]/, message: 'Debe incluir al menos una mayúscula' },
  { test: /\d/, message: 'Debe incluir al menos un número' },
  { test: /[^A-Za-z0-9]/, message: 'Debe incluir al menos un símbolo (ej. ! # $)' },
];

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

      @if (sent()) {
        <div
          class="mt-8 rounded-3xl border border-line bg-surface p-8 text-center"
          role="status"
        >
          <p class="font-display text-xl font-bold">Revisa tu correo</p>
          <p class="mt-2 text-sm text-muted">
            Te enviamos un enlace de verificación a
            <span class="font-medium text-ink">{{ sentEmail() }}</span>.
            Ábrelo para activar tu cuenta.
          </p>
          @if (resendNotice()) {
            <p class="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
              {{ resendNotice() }}
            </p>
          }
          @if (resendError()) {
            <p class="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {{ resendError() }}
            </p>
          }
          <button
            type="button"
            (click)="onResend()"
            [disabled]="resendBusy() || cooldown() > 0"
            class="mt-5 inline-flex w-full items-center justify-center rounded-full border border-line px-6 py-3 font-bold disabled:opacity-50"
          >
            {{ resendLabel() }}
          </button>
          <a
            routerLink="/ingresar"
            class="mt-3 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 font-bold text-accent-ink"
          >
            Volver a ingresar
          </a>
        </div>
      } @else {
        <form
          class="mt-8"
          aria-label="Formulario de registro"
          [attr.aria-busy]="submitting()"
          (submit)="onSubmit($event)"
        >
          <fieldset class="contents space-y-4" [disabled]="submitting()">
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
                @if (registerForm.password().touched() && registerForm.password().invalid()) {
                  <ul class="mt-1 space-y-0.5 text-sm text-red-500">
                    @for (e of registerForm.password().errors(); track $index) {
                      <li>{{ e.message }}</li>
                    }
                  </ul>
                }
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
                @if (
                  registerForm.confirmPassword().touched() &&
                  registerForm.confirmPassword().invalid()
                ) {
                  <p class="mt-1 text-sm text-red-500">
                    @for (e of registerForm.confirmPassword().errors(); track $index) {
                      {{ e.message }}
                    }
                  </p>
                }
              </div>
            </div>
            <div>
              <label for="register-pet" class="text-sm font-medium">
                Tu mascota <span class="font-normal text-muted">(opcional)</span>
              </label>
              <select
                id="register-pet"
                [formField]="registerForm.petType"
                class="mt-1 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
              >
                <option value="">Prefiero no decir</option>
                @for (pet of petOptions; track pet.value) {
                  <option [value]="pet.value">{{ pet.label }}</option>
                }
              </select>
              <p class="mt-1 text-sm text-muted">
                Nos ayuda a recomendarte productos para tu compañero.
              </p>
            </div>
            @if (error()) {
              <p
                role="alert"
                class="rounded-xl border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-600"
              >
                {{ error() }}
                @if (emailTaken()) {
                  <a routerLink="/ingresar" class="font-medium underline">Iniciar sesión</a>
                }
              </p>
            }
            <button
              type="submit"
              [disabled]="submitting()"
              class="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 font-bold text-accent-ink disabled:opacity-50"
            >
              {{ submitting() ? 'Creando cuenta…' : 'Crear cuenta' }}
            </button>
          </fieldset>
        </form>

        <p class="mt-6 text-center text-sm text-muted">
          ¿Ya tienes cuenta?
          <a routerLink="/ingresar" class="font-medium text-accent hover:underline">
            Inicia sesión
          </a>
        </p>
      }
    </app-auth-shell>
  `,
})
export class RegisterView {
  private readonly auth = inject(AuthUsecase);
  private readonly cooldownState = createResendCooldown();

  protected readonly petOptions = PET_OPTIONS;

  protected readonly model = signal<RegisterModel>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    petType: '',
  });

  protected readonly registerForm = form(this.model, (f) => {
    validate(f.name, ({ value }) => {
      const name = value().trim();
      if (name.length === 0) {
        return { kind: 'required', message: 'El nombre es obligatorio' };
      }
      if (name.length < 2) {
        return { kind: 'minLength', message: 'El nombre debe tener al menos 2 caracteres' };
      }
      return null;
    });
    required(f.email, { message: 'El email es obligatorio' });
    email(f.email, { message: 'Ingresa un email válido' });
    required(f.password, { message: 'La contraseña es obligatoria' });
    minLength(f.password, 8, { message: 'Mínimo 8 caracteres' });
    validate(f.password, ({ value }) => {
      const password = value();
      // An empty password is already reported by `required`; don't pile on.
      if (password.length === 0) return null;
      const missing = PASSWORD_RULES.filter((rule) => !rule.test.test(password)).map(
        (rule) => ({ kind: 'password', message: rule.message }),
      );
      return missing.length > 0 ? missing : null;
    });
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
  protected readonly emailTaken = signal(false);
  protected readonly submitting = signal(false);
  protected readonly sent = signal(false);
  protected readonly sentEmail = signal('');

  protected readonly resendBusy = signal(false);
  protected readonly resendError = signal<string | null>(null);
  protected readonly resendNotice = signal<string | null>(null);
  protected readonly cooldown = this.cooldownState.remaining;
  protected readonly resendLabel = computed(() => {
    if (this.resendBusy()) return 'Reenviando…';
    const seconds = this.cooldown();
    return seconds > 0 ? `Reenviar en ${seconds}s` : 'Reenviar correo';
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set(null);
    this.emailTaken.set(false);
    this.submitting.set(true);
    try {
      const ok = await submit(this.registerForm, async () => {
        await new Promise<void>((resolve, reject) => {
          this.auth.register(this.toRegisterData()).subscribe({ next: () => resolve(), error: reject });
        });
      });
      if (ok) {
        this.sentEmail.set(this.model().email.trim());
        this.sent.set(true);
        // A link was just sent, so the resend action starts on cooldown.
        this.cooldownState.start();
      } else {
        this.focusFirstInvalidField();
      }
    } catch (error) {
      this.error.set(
        error instanceof AuthError ? error.message : 'No pudimos crear tu cuenta. Intenta de nuevo.',
      );
      this.emailTaken.set(error instanceof AuthError && error.code === 'email_taken');
    } finally {
      this.submitting.set(false);
    }
  }

  protected async onResend(): Promise<void> {
    if (this.resendBusy() || this.cooldown() > 0) return;
    this.resendBusy.set(true);
    this.resendError.set(null);
    this.resendNotice.set(null);
    try {
      await new Promise<void>((resolve, reject) => {
        this.auth.resendVerification(this.sentEmail()).subscribe({ next: () => resolve(), error: reject });
      });
      this.resendNotice.set('Si el correo está registrado, te enviamos un nuevo enlace.');
    } catch (error) {
      this.resendError.set(
        error instanceof AuthError ? error.message : 'No pudimos reenviar el correo. Intenta de nuevo.',
      );
    } finally {
      this.resendBusy.set(false);
      this.cooldownState.start();
    }
  }

  /** `petType` is optional, so the empty option is omitted from the payload. */
  private toRegisterData(): RegisterData {
    const { name, email, password, petType } = this.model();
    const data: RegisterData = { name: name.trim(), email: email.trim(), password };
    if (petType !== '') data.petType = petType;
    return data;
  }

  private focusFirstInvalidField(): void {
    const candidates: ReadonlyArray<{ id: string; invalid: boolean }> = [
      { id: 'register-name', invalid: this.registerForm.name().invalid() },
      { id: 'register-email', invalid: this.registerForm.email().invalid() },
      { id: 'register-password', invalid: this.registerForm.password().invalid() },
      { id: 'register-confirm', invalid: this.registerForm.confirmPassword().invalid() },
    ];
    const first = candidates.find((candidate) => candidate.invalid);
    if (first) document.getElementById(first.id)?.focus();
  }
}
