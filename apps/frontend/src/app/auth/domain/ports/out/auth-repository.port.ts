import type { Observable } from 'rxjs';
import type { LoginCredentials, RecoverData, User } from '../../models/auth.model';

/**
 * Session slice of the auth contract (login, current user, logout).
 *
 * Registration, email verification and resend live in
 * `RegistrationRepositoryPort`, which already talks to the real API. When
 * US-001 (login) lands, both ports collapse into one HTTP adapter.
 */
export abstract class AuthRepositoryPort {
  abstract login(credentials: LoginCredentials): Observable<User>;
  abstract recover(data: RecoverData): Observable<void>;
  abstract currentUser(): Observable<User | null>;
  abstract logout(): Observable<void>;
}
