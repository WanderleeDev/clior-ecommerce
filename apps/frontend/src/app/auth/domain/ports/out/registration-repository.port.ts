import type { Observable } from 'rxjs';
import type { RegisterData, RegisterResult } from '../../models/auth.model';

/**
 * Registration slice of the auth contract.
 *
 * Kept separate from `AuthRepositoryPort` on purpose: login, refresh and
 * logout still run against the mock, while registration, verification and
 * resend are already real. When US-001 lands, both ports collapse into one
 * HTTP adapter.
 */
export abstract class RegistrationRepositoryPort {
  abstract register(data: RegisterData): Observable<RegisterResult>;
  abstract verifyEmail(token: string): Observable<void>;
  abstract resendVerification(email: string): Observable<void>;
}
