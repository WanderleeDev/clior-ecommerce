import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SessionService } from '../session/session.service';
import { authInterceptor } from './auth.interceptor';

const apiUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  petType: null,
  createdAt: '2024-01-15T12:00:00.000Z',
};

function setup(platform: 'browser' | 'server' = 'browser'): {
  client: HttpClient;
  session: SessionService;
  http: HttpTestingController;
} {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptors([authInterceptor])),
      provideHttpClientTesting(),
      { provide: PLATFORM_ID, useValue: platform },
    ],
  });
  return {
    client: TestBed.inject(HttpClient),
    session: TestBed.inject(SessionService),
    http: TestBed.inject(HttpTestingController),
  };
}

describe('authInterceptor (browser)', () => {
  let client: HttpClient;
  let session: SessionService;
  let http: HttpTestingController;

  beforeEach(() => {
    ({ client, session, http } = setup());
  });

  afterEach(() => http.verify());

  it('attaches the in-memory bearer token to API requests', () => {
    session.setToken('access-1');
    client.get('/api/products').subscribe();

    const request = http.expectOne('/api/products');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-1');
    request.flush([]);
  });

  it('sends no Authorization header without a session', () => {
    client.get('/api/products').subscribe();

    const request = http.expectOne('/api/products');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush([]);
  });

  it('leaves non-API requests untouched', () => {
    session.setToken('access-1');
    client.get('/assets/logo.svg').subscribe();

    const request = http.expectOne('/assets/logo.svg');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush('');
  });

  it('refreshes once on a 401 and retries the original request with the new token', () => {
    session.setToken('expired-access');
    let body: unknown;
    client.get('/api/products').subscribe((value) => (body = value));

    http
      .expectOne('/api/products')
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne('/api/auth/refresh');
    expect(refresh.request.withCredentials).toBe(true);
    refresh.flush({ accessToken: 'access-2', user: apiUser });

    const retried = http.expectOne('/api/products');
    expect(retried.request.headers.get('Authorization')).toBe('Bearer access-2');
    retried.flush([{ id: 'p-1' }]);
    expect(body).toEqual([{ id: 'p-1' }]);
  });

  it('retries at most once when the retried request is also a 401', () => {
    session.setToken('expired-access');
    let caught: unknown;
    client.get('/api/products').subscribe({ error: (error: unknown) => (caught = error) });

    http
      .expectOne('/api/products')
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    http.expectOne('/api/auth/refresh').flush({ accessToken: 'access-2', user: apiUser });
    http
      .expectOne('/api/products')
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(caught).toMatchObject({ status: 401 });
    http.expectNone('/api/auth/refresh');
  });

  it('shares one refresh between concurrent 401s (single-flight)', () => {
    session.setToken('expired-access');
    client.get('/api/products').subscribe();
    client.get('/api/orders').subscribe();

    const first = http.match('/api/products');
    const second = http.match('/api/orders');
    expect(first).toHaveLength(1);
    expect(second).toHaveLength(1);
    first[0].flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    second[0].flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne('/api/auth/refresh');
    refresh.flush({ accessToken: 'access-2', user: apiUser });

    for (const request of [...http.match('/api/products'), ...http.match('/api/orders')]) {
      expect(request.request.headers.get('Authorization')).toBe('Bearer access-2');
      request.flush([]);
    }
  });

  it('gives up and clears the session when the refresh itself fails', () => {
    session.setToken('expired-access');
    let caught: unknown;
    client.get('/api/products').subscribe({ error: (error: unknown) => (caught = error) });

    http
      .expectOne('/api/products')
      .flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    http
      .expectOne('/api/auth/refresh')
      .flush({ message: 'Invalid refresh token' }, { status: 401, statusText: 'Unauthorized' });

    expect(caught).toMatchObject({ status: 401 });
    expect(session.token()).toBeNull();
    http.expectNone('/api/products');
  });

  it('never refreshes for the auth endpoints themselves', () => {
    let caught: unknown;
    client
      .post('/api/auth/login', { email: 'maria@example.com', password: 'wrong' })
      .subscribe({ error: (error: unknown) => (caught = error) });

    http
      .expectOne('/api/auth/login')
      .flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(caught).toMatchObject({ status: 401 });
    http.expectNone('/api/auth/refresh');
  });
});

describe('authInterceptor (server/prerender)', () => {
  it('passes requests through without auth side effects', () => {
    const { client, session, http } = setup('server');
    session.setToken('access-1');
    let caught: unknown;
    client.get('/api/products').subscribe({ error: (error: unknown) => (caught = error) });

    const request = http.expectOne('/api/products');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    expect(caught).toMatchObject({ status: 401 });
    http.expectNone('/api/auth/refresh');
    http.verify();
  });
});