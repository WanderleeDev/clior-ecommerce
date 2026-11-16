import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthError } from '../../domain/errors/auth.error';
import type { RegisterResult } from '../../domain/models/auth.model';
import { RegistrationRepositoryPort } from '../../domain/ports/out/registration-repository.port';
import { HttpRegistrationAdapter } from './http-registration.adapter';

describe('HttpRegistrationAdapter', () => {
  let adapter: RegistrationRepositoryPort;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: RegistrationRepositoryPort, useClass: HttpRegistrationAdapter },
      ],
    });
    adapter = TestBed.inject(RegistrationRepositoryPort);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('registers against the proxied API with the optional pet type', () => {
    let result: RegisterResult | undefined;
    adapter
      .register({ name: 'Maria', email: 'maria@example.com', password: 'Secure-password1!', petType: 'cat' })
      .subscribe((value) => (result = value));

    const request = http.expectOne('/api/auth/register');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'Secure-password1!',
      petType: 'cat',
    });

    request.flush({ message: 'Cuenta creada.' });
    expect(result).toEqual({ message: 'Cuenta creada.' });
  });

  it('omits the pet type when the customer did not choose one', () => {
    adapter
      .register({ name: 'Maria', email: 'maria@example.com', password: 'Secure-password1!' })
      .subscribe();

    const request = http.expectOne('/api/auth/register');
    expect(request.request.body).not.toHaveProperty('petType');
    request.flush({ message: 'Cuenta creada.' });
  });

  it('sends the one-time token to the verification endpoint', () => {
    let completed = false;
    adapter.verifyEmail('one-time-token').subscribe(() => (completed = true));

    const request = http.expectOne('/api/auth/verify-email');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ token: 'one-time-token' });

    request.flush(null);
    expect(completed).toBe(true);
  });

  it('requests a new verification email for an address', () => {
    adapter.resendVerification('maria@example.com').subscribe();

    const request = http.expectOne('/api/auth/resend-verification');
    expect(request.request.body).toEqual({ email: 'maria@example.com' });
    request.flush(null);
  });

  it('surfaces a duplicate account as a typed, translated error', () => {
    let caught: unknown;
    adapter
      .register({ name: 'Maria', email: 'maria@example.com', password: 'Secure-password1!' })
      .subscribe({ error: (error: unknown) => (caught = error) });

    http
      .expectOne('/api/auth/register')
      .flush({ message: 'Email is already registered' }, { status: 409, statusText: 'Conflict' });

    expect(caught).toBeInstanceOf(AuthError);
    expect((caught as AuthError).code).toBe('email_taken');
  });
});
