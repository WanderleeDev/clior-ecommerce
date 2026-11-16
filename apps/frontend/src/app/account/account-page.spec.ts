import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, type Observable } from 'rxjs';
import type { User } from '../auth/domain/models/auth.model';
import { AuthUsecase } from '../auth/domain/ports/in/auth.usecase';
import { AccountPage } from './account-page';

const baseUser: User = {
  id: 'user-1',
  name: 'Maria Torres',
  email: 'maria@example.com',
  role: 'customer',
  petType: null,
  createdAt: '2024-01-15T12:00:00.000Z',
  memberSince: 'enero de 2024',
};

class FakeAuth extends AuthUsecase {
  meResult: User | null = baseUser;

  override me(): Observable<User | null> {
    return of(this.meResult);
  }

  override login(): Observable<never> {
    throw new Error('not used');
  }

  override register(): Observable<never> {
    throw new Error('not used');
  }

  override verifyEmail(): Observable<void> {
    return of(undefined);
  }

  override resendVerification(): Observable<void> {
    return of(undefined);
  }

  override recover(): Observable<void> {
    return of(undefined);
  }

  override logout(): Observable<void> {
    return of(undefined);
  }
}

describe('AccountPage session display', () => {
  let auth: FakeAuth;

  beforeEach(async () => {
    auth = new FakeAuth();
    await TestBed.configureTestingModule({
      imports: [AccountPage],
      providers: [provideRouter([]), { provide: AuthUsecase, useValue: auth }],
    }).compileComponents();
  });

  it('shows the real member-since label derived from the API', async () => {
    const fixture = TestBed.createComponent(AccountPage);
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('enero de 2024');
  });

  it('shows the pet label when the customer chose one', async () => {
    auth.meResult = { ...baseUser, petType: 'cat', pet: 'Gato' };
    const fixture = TestBed.createComponent(AccountPage);
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Gato');
  });

  it('shows a friendly placeholder instead of an empty pet card', async () => {
    const fixture = TestBed.createComponent(AccountPage);
    fixture.detectChanges();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Aún no registraste tu mascota');
  });
});