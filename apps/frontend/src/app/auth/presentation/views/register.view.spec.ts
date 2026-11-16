import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthError } from '../../domain/errors/auth.error';
import type { RegisterData, RegisterResult } from '../../domain/models/auth.model';
import { AuthUsecase } from '../../domain/ports/in/auth.usecase';
import { RegisterView } from './register.view';

class FakeAuth extends AuthUsecase {
  readonly registered: RegisterData[] = [];
  readonly resent: string[] = [];
  failure: AuthError | null = null;

  override register(data: RegisterData): Observable<RegisterResult> {
    this.registered.push(data);
    return this.failure ? throwError(() => this.failure) : of({ message: 'Cuenta creada.' });
  }

  override verifyEmail(): Observable<void> {
    return of(undefined);
  }

  override resendVerification(email: string): Observable<void> {
    this.resent.push(email);
    return of(undefined);
  }

  override login(): Observable<never> {
    throw new Error('not used');
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

function fill(name: string, email: string, password: string, confirm: string, pet?: string): void {
  const query = <T extends HTMLElement>(selector: string): T => {
    const element = document.querySelector<T>(selector);
    if (!element) throw new Error(`missing ${selector}`);
    return element;
  };

  const values: Array<[string, string]> = [
    ['#register-name', name],
    ['#register-email', email],
    ['#register-password', password],
    ['#register-confirm', confirm],
  ];
  for (const [selector, value] of values) {
    const input = query<HTMLInputElement>(selector);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  if (pet !== undefined) {
    const select = query<HTMLSelectElement>('#register-pet');
    select.value = pet;
    select.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

async function submit(fixture: ReturnType<typeof TestBed.createComponent<RegisterView>>): Promise<void> {
  const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('RegisterView', () => {
  let auth: FakeAuth;

  beforeEach(async () => {
    auth = new FakeAuth();
    await TestBed.configureTestingModule({
      imports: [RegisterView],
      providers: [provideRouter([]), { provide: AuthUsecase, useValue: auth }],
    }).compileComponents();
  });

  it('offers the pet as a provided list instead of free text', async () => {
    const fixture = TestBed.createComponent(RegisterView);
    fixture.detectChanges();
    await fixture.whenStable();

    const select = fixture.nativeElement.querySelector('#register-pet') as HTMLSelectElement;
    expect(select.tagName).toBe('SELECT');
    expect(Array.from(select.options).map((option) => option.textContent?.trim())).toEqual([
      'Prefiero no decir',
      'Perro',
      'Gato',
      'Mascota pequeña',
    ]);
  });

  it('sends the selected pet type so the catalog can personalize recommendations', async () => {
    const fixture = TestBed.createComponent(RegisterView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill('Maria', 'maria@example.com', 'Secure-password1!', 'Secure-password1!', 'cat');
    await submit(fixture);

    expect(auth.registered).toEqual([
      {
        name: 'Maria',
        email: 'maria@example.com',
        password: 'Secure-password1!',
        petType: 'cat',
      },
    ]);
  });

  it('sends no pet type when the customer skips the optional field', async () => {
    const fixture = TestBed.createComponent(RegisterView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill('Maria', 'maria@example.com', 'Secure-password1!', 'Secure-password1!');
    await submit(fixture);

    expect(auth.registered).toHaveLength(1);
    expect(auth.registered[0]).not.toHaveProperty('petType');
  });

  it('blocks a weak password locally with the backend rules in Spanish', async () => {
    const fixture = TestBed.createComponent(RegisterView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill('Maria', 'maria@example.com', 'onlylowercase', 'onlylowercase');
    await submit(fixture);

    expect(auth.registered).toEqual([]);
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Debe incluir al menos una mayúscula');
    expect(text).toContain('Debe incluir al menos un número');
    expect(text).toContain('Debe incluir al menos un símbolo');
  });

  it('shows the review-your-inbox state with a resend action after registering', async () => {
    const fixture = TestBed.createComponent(RegisterView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill('Maria', 'maria@example.com', 'Secure-password1!', 'Secure-password1!', 'dog');
    await submit(fixture);

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Revisa tu correo');
    expect(text).toContain('maria@example.com');
    expect(fixture.nativeElement.querySelector('#register-name')).toBeNull();

    const resend = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Reenviar'));
    expect(resend?.disabled).toBe(true);
    expect(resend?.textContent).toContain('Reenviar en');

    resend?.click();
    await fixture.whenStable();
    expect(auth.resent).toEqual([]);
  });

  it('explains a duplicate account and offers the login screen, never the 409', async () => {
    auth.failure = new AuthError(
      'email_taken',
      'Ese email ya está registrado. Inicia sesión para continuar.',
    );
    const fixture = TestBed.createComponent(RegisterView);
    fixture.detectChanges();
    await fixture.whenStable();

    fill('Maria', 'maria@example.com', 'Secure-password1!', 'Secure-password1!');
    await submit(fixture);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Ese email ya está registrado');
    expect(element.querySelector('[role="alert"] a')?.getAttribute('href')).toBe('/ingresar');
    expect(element.querySelector('#register-name')).not.toBeNull();
  });
});
