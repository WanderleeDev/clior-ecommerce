import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthError } from '../../domain/errors/auth.error';
import type { User } from '../../domain/models/auth.model';
import { SessionService } from './session.service';

const apiUser = {
  id: 'user-1',
  email: 'maria@example.com',
  name: 'Maria',
  role: 'customer',
  petType: null,
  createdAt: '2024-01-15T12:00:00.000Z',
};

describe('SessionService', () => {
  let session: SessionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    session = TestBed.inject(SessionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('keeps the access token in memory only', () => {
    session.setToken('access-1');

    expect(session.token()).toBe('access-1');

    session.clear();
    expect(session.token()).toBeNull();
  });

  it('refreshes through the cookie endpoint and stores the rotated token', () => {
    let user: User | undefined;
    session.refresh().subscribe((value) => (user = value));

    const request = http.expectOne('/api/auth/refresh');
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBe(true);

    request.flush({ accessToken: 'access-2', user: apiUser });
    expect(session.token()).toBe('access-2');
    expect(user?.id).toBe('user-1');
  });

  it('shares a single refresh request between concurrent callers', () => {
    const users: User[] = [];
    session.refresh().subscribe((value) => users.push(value));
    session.refresh().subscribe((value) => users.push(value));

    const request = http.expectOne('/api/auth/refresh');
    request.flush({ accessToken: 'access-2', user: apiUser });

    expect(users).toHaveLength(2);
    http.expectNone('/api/auth/refresh');
  });

  it('issues a new request once the previous refresh completed (rotation)', () => {
    session.refresh().subscribe();
    http.expectOne('/api/auth/refresh').flush({ accessToken: 'access-2', user: apiUser });

    session.refresh().subscribe();
    http.expectOne('/api/auth/refresh').flush({ accessToken: 'access-3', user: apiUser });

    expect(session.token()).toBe('access-3');
  });

  it('clears the session and surfaces a typed error when refresh fails', () => {
    session.setToken('stale-access');
    let caught: unknown;
    session.refresh().subscribe({ error: (error: unknown) => (caught = error) });

    http
      .expectOne('/api/auth/refresh')
      .flush({ message: 'Invalid refresh token' }, { status: 401, statusText: 'Unauthorized' });

    expect(caught).toBeInstanceOf(AuthError);
    expect(session.token()).toBeNull();
  });
});