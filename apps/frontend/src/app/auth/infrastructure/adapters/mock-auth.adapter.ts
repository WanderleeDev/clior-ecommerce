import { Injectable, signal } from '@angular/core';
import { of, tap, type Observable } from 'rxjs';
import { AuthRepositoryPort } from '../../domain/ports/out/auth-repository.port';
import type { LoginCredentials, RecoverData, RegisterData, User } from '../../domain/models/auth.model';

const MOCK_USER: User = {
  id: 'u-1',
  name: 'Mariana Torres',
  email: 'mariana@ejemplo.com',
  pet: 'Rocky · Labrador 3 años',
  memberSince: 'Enero 2024',
};

@Injectable()
export class MockAuthAdapter extends AuthRepositoryPort {
  private readonly user = signal<User | null>(MOCK_USER);

  override login(credentials: LoginCredentials): Observable<User> {
    const user: User = { ...MOCK_USER, email: credentials.email };
    return of(user).pipe(tap((u) => this.user.set(u)));
  }

  override register(data: RegisterData): Observable<User> {
    const user: User = {
      id: 'u-new',
      name: data.name,
      email: data.email,
      pet: data.pet || 'Sin mascota registrada',
      memberSince: 'Hoy',
    };
    return of(user).pipe(tap((u) => this.user.set(u)));
  }

  override recover(_data: RecoverData): Observable<void> {
    return of(undefined);
  }

  override currentUser(): Observable<User | null> {
    return of(this.user());
  }

  override logout(): Observable<void> {
    return of(undefined).pipe(tap(() => this.user.set(null)));
  }
}
