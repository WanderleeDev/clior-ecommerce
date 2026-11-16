import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthError } from '../../domain/errors/auth.error';
import type { User } from '../../domain/models/auth.model';
import { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.port';
import { authInterceptor } from '../http/auth.interceptor';
import { SessionService } from '../session/session.service';
import { HttpAuthAdapter } from './http-auth.adapter';

const apiUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  petType: 'cat',
  createdAt: '2024-01-15T12:00:00.000Z',
};

describe('HttpAuthAdapter', () => {
  let adapter: AuthRepositoryPort;
  let session: SessionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthRepositoryPort, useClass: HttpAuthAdapter },
      ],
    });
    adapter = TestBed.inject(AuthRepositoryPort);
    session = TestBed.inject(SessionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('logs in against the proxied API and keeps the access token in memory', () => {
    let user: User | undefined;
    adapter
      .login({ email: 'maria@example.com', password: 'Secure-password1!' })
      .subscribe((value) => (user = value));

    const request = http.expectOne('/api/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.body).toEqual({
      email: 'maria@example.com',
      password: 'Secure-password1!',
    });

    request.flush({ accessToken: 'access-1', user: apiUser });
    expect(user?.name).toBe('Maria');
    expect(user?.petType).toBe('cat');
    expect(session.token()).toBe('access-1');
  });

  it.each([
    [401, { message: 'Invalid credentials' }, 'invalid_credentials'],
    [401, { message: 'Account is temporarily locked' }, 'locked'],
    [403, { message: 'Email address must be verified before login' }, 'unverified'],
  ] as const)('maps login status %s to the typed code %s', (status, body, code) => {
    let caught: unknown;
    adapter
      .login({ email: 'maria@example.com', password: 'wrong' })
      .subscribe({ error: (error: unknown) => (caught = error) });

    http.expectOne('/api/auth/login').flush(body, { status, statusText: 'Error' });

    expect(caught).toBeInstanceOf(AuthError);
    expect((caught as AuthError).code).toBe(code);
    expect(session.token()).toBeNull();
  });

  it('revokes the refresh cookie on logout and clears the local session', () => {
    session.setToken('access-1');
    let completed = false;
    adapter.logout().subscribe(() => (completed = true));

    const request = http.expectOne('/api/auth/logout');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBe(true);

    request.flush(null);
    expect(completed).toBe(true);
    expect(session.token()).toBeNull();
  });

  it('resolves currentUser to null without any request when there is no session', () => {
    let user: User | null | undefined;
    adapter.currentUser().subscribe((value) => (user = value));

    http.expectNone('/api/auth/me');
    expect(user).toBeNull();
  });

  it('hydrates currentUser from /auth/me with the in-memory bearer token', () => {
    session.setToken('access-1');
    let user: User | null | undefined;
    adapter.currentUser().subscribe((value) => (user = value));

    const request = http.expectOne('/api/auth/me');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-1');

    request.flush(apiUser);
    expect(user?.id).toBe('user-1');
  });

  it('requests a password reset through the forgot-password endpoint', () => {
    let completed = false;
    adapter.recover({ email: 'maria@example.com' }).subscribe(() => (completed = true));

    const request = http.expectOne('/api/auth/forgot-password');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'maria@example.com' });

    request.flush(null);
    expect(completed).toBe(true);
  });
});