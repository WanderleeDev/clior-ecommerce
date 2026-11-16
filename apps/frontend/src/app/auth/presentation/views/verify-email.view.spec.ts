import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { MockInstance } from 'vitest';
import { ActivatedRoute, convertToParamMap, Router, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthError } from '../../domain/errors/auth.error';
import type { RegisterResult } from '../../domain/models/auth.model';
import { AuthUsecase } from '../../domain/ports/in/auth.usecase';
import { VerifyEmailView } from './verify-email.view';

class FakeAuth extends AuthUsecase {
  readonly verified: string[] = [];
  readonly resent: string[] = [];
  failure: AuthError | null = null;

  override verifyEmail(token: string): Observable<void> {
    this.verified.push(token);
    return this.failure ? throwError(() => this.failure) : of(undefined);
  }

  override resendVerification(email: string): Observable<void> {
    this.resent.push(email);
    return of(undefined);
  }

  override register(): Observable<RegisterResult> {
    throw new Error('not used');
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

interface RenderOptions {
  token?: string;
  failure?: AuthError;
}

describe('VerifyEmailView', () => {
  let auth: FakeAuth;
  let navigate: MockInstance;

  async function render(
    options: RenderOptions = {},
  ): Promise<{ element: HTMLElement; fixture: ComponentFixture<VerifyEmailView> }> {
    TestBed.resetTestingModule();
    auth = new FakeAuth();
    auth.failure = options.failure ?? null;

    await TestBed.configureTestingModule({
      imports: [VerifyEmailView],
      providers: [
        provideRouter([]),
        { provide: AuthUsecase, useValue: auth },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap(
                options.token === undefined ? {} : { token: options.token },
              ),
            },
          },
        },
      ],
    }).compileComponents();

    // Keep the real Router so `routerLink` still renders href attributes; only
    // the programmatic navigation that drops the token is observed.
    navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    const fixture = TestBed.createComponent(VerifyEmailView);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return { element: fixture.nativeElement as HTMLElement, fixture };
  }

  it('consumes the token exactly once and confirms the account', async () => {
    const { element } = await render({ token: 'one-time-token' });

    expect(auth.verified).toEqual(['one-time-token']);
    expect(element.textContent).toContain('Tu correo está verificado');
    expect(element.querySelector('a[href="/ingresar"]')).not.toBeNull();
  });

  it('drops the token from the URL so it cannot leak through the referrer', async () => {
    await render({ token: 'one-time-token' });

    expect(navigate).toHaveBeenCalledWith([], { queryParams: {}, replaceUrl: true });
  });

  it('explains an expired or reused link and offers a resend', async () => {
    const { element } = await render({
      token: 'stale-token',
      failure: new AuthError('invalid_token', 'El enlace no es válido o ya venció. Pide uno nuevo.'),
    });

    expect(element.textContent).toContain('ya no sirve');
    expect(element.textContent).toContain('venció');
    expect(element.querySelector('#verify-email')).not.toBeNull();
  });

  it('asks for a new link when the URL has no token', async () => {
    const { element } = await render();

    expect(auth.verified).toEqual([]);
    expect(element.textContent).toContain('está incompleto');
    expect(element.querySelector('#verify-email')).not.toBeNull();
  });

  it('resends the verification email and starts the cooldown', async () => {
    const { element, fixture } = await render();

    const input = element.querySelector('#verify-email') as HTMLInputElement;
    input.value = 'maria@example.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const form = element.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(auth.resent).toEqual(['maria@example.com']);
    expect(element.textContent).toContain('te enviamos un nuevo enlace');

    const button = element.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Reenviar en');
  });
});
