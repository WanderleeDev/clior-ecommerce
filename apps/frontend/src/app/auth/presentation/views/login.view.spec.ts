import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Subject, of, throwError, type Observable } from 'rxjs';
import { AuthError } from '../../domain/errors/auth.error';
import type { LoginCredentials, User } from '../../domain/models/auth.model';
import { AuthUsecase } from '../../domain/ports/in/auth.usecase';
import { AuthStore } from '../state/auth.store';
import { LoginView } from './login.view';

const user: User = {
  id: 'user-1',
  name: 'Maria',
  email: 'maria@example.com',
  role: 'customer',
  petType: 'cat',
  createdAt: '2024-01-15T12:00:00.000Z',
};

class FakeAuth extends AuthUsecase {
  readonly loginCalls: LoginCredentials[] = [];
  readonly resent: string[] = [];
  failure: AuthError | null = null;
  inFlight: Subject<User> | null = null;

  override login(credentials: LoginCredentials): Observable<User> {
    this.loginCalls.push(credentials);
    if (this.inFlight) return this.inFlight;
    return this.failure ? throwError(() => this.failure) : of(user);
  }

  override resendVerification(email: string): Observable<void> {
    this.resent.push(email);
    return of(undefined);
  }

  override register(): Observable<never> {
    throw new Error('not used');
  }

  override verifyEmail(): Observable<void> {
    return of(undefined);
  }

  override recover(): Observable<void> {
    return of(undefined);
  }

  override me(): Observable<null> {
    return of(null);
  }

  override logout(): Observable<void> {
    return of(undefined);
  }
}

function fill(fixture: ReturnType<typeof TestBed.createComponent<LoginView>>, email: string, password: string): void {
  for (const [selector, value] of [
    ['#login-email', email],
    ['#login-password', password],
  ] as const) {
    const input = document.querySelector<HTMLInputElement>(selector);
    if (!input) throw new Error(`missing ${selector}`);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  fixture.detectChanges();
}

async function submit(fixture: ReturnType<typeof TestBed.createComponent<LoginView>>): Promise<void> {
  const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  await fixture.whenStable();
  fixture.detectChanges();
}

function text(fixture: ReturnType<typeof TestBed.createComponent<LoginView>>): string {
  return (fixture.nativeElement as HTMLElement).textContent ?? '';
}

describe('LoginView', () => {
  let auth: FakeAuth;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    auth = new FakeAuth();
    await TestBed.configureTestingModule({
      imports: [LoginView],
      providers: [provideRouter([]), { provide: AuthUsecase, useValue: auth }],
    }).compileComponents();
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate');
  });

  it('disables native validation so the Spanish signal-forms errors can run (S5)', async () => {
    const fixture = TestBed.createComponent(LoginView);
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    expect(form.noValidate).toBe(true);
  });

  it('blocks an empty submit locally with announced Spanish field errors (S5)', async () => {
    const fixture = TestBed.createComponent(LoginView);
    fixture.detectChanges();
    await fixture.whenStable();

    await submit(fixture);

    expect(auth.loginCalls).toEqual([]);
    expect(text(fixture)).toContain('El email es obligatorio');
    expect(text(fixture)).toContain('La contraseña es obligatoria');
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    expect(form.querySelectorAll('[aria-live]').length).toBeGreaterThan(0);
  });

  it('rejects a malformed email locally without calling the API (S5)', async () => {
    const fixture = TestBed.createComponent(LoginView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill(fixture, 'not-an-email', 'whatever-123');
    await submit(fixture);

    expect(auth.loginCalls).toEqual([]);
    expect(text(fixture)).toContain('Ingresa un email válido');
  });

  it('shows the mapped Spanish error, keeps the email and clears the password (S2)', async () => {
    auth.failure = new AuthError('invalid_credentials', 'Email o contraseña incorrectos.');
    const fixture = TestBed.createComponent(LoginView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill(fixture, 'maria@example.com', 'wrong-password');
    await submit(fixture);

    expect(text(fixture)).toContain('Email o contraseña incorrectos.');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    expect(document.querySelector<HTMLInputElement>('#login-email')?.value).toBe('maria@example.com');
    expect(document.querySelector<HTMLInputElement>('#login-password')?.value).toBe('');
    expect(text(fixture)).not.toContain('La contraseña es obligatoria');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('explains a temporary lock in Spanish (S4)', async () => {
    auth.failure = new AuthError(
      'locked',
      'Tu cuenta está bloqueada temporalmente por varios intentos fallidos. Espera unos minutos e intenta de nuevo.',
    );
    const fixture = TestBed.createComponent(LoginView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill(fixture, 'maria@example.com', 'correct-password');
    await submit(fixture);

    expect(text(fixture)).toContain('bloqueada temporalmente');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('offers a working resend action for an unverified email (S3)', async () => {
    auth.failure = new AuthError(
      'unverified',
      'Tu correo aún no está verificado. Revisa tu bandeja o reenvía el correo de verificación.',
    );
    const fixture = TestBed.createComponent(LoginView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill(fixture, 'maria@example.com', 'correct-password');
    await submit(fixture);

    expect(text(fixture)).toContain('aún no está verificado');
    expect(navigate).not.toHaveBeenCalled();

    const resend = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Reenviar correo'));
    expect(resend).toBeDefined();

    resend?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(auth.resent).toEqual(['maria@example.com']);
    expect(resend?.disabled).toBe(true);
    expect(resend?.textContent).toContain('Reenviar en');
  });

  it('disables the form while in flight and ignores a second submit (S6)', async () => {
    auth.inFlight = new Subject<User>();
    const fixture = TestBed.createComponent(LoginView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill(fixture, 'maria@example.com', 'correct-password');
    await submit(fixture);

    const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Ingresando…');

    await submit(fixture);
    expect(auth.loginCalls).toHaveLength(1);

    auth.inFlight.next(user);
    auth.inFlight.complete();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(navigate).toHaveBeenCalledWith(['/cuenta']);
  });

  it('hydrates the store and lands on /cuenta after a successful login (S1)', async () => {
    const fixture = TestBed.createComponent(LoginView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill(fixture, 'maria@example.com', 'correct-password');
    await submit(fixture);

    expect(TestBed.inject(AuthStore).current()).toEqual(user);
    expect(navigate).toHaveBeenCalledWith(['/cuenta']);
  });

  it('redirects an already authenticated visitor to /cuenta', async () => {
    TestBed.inject(AuthStore).set(user);
    const fixture = TestBed.createComponent(LoginView);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith(['/cuenta']);
  });
});