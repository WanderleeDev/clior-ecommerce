import type { Observable } from 'rxjs';
import type { LoginCredentials, RecoverData, RegisterData, User } from '../../models/auth.model';

export abstract class AuthUsecase {
  abstract login(credentials: LoginCredentials): Observable<User>;
  abstract register(data: RegisterData): Observable<User>;
  abstract recover(data: RecoverData): Observable<void>;
  abstract me(): Observable<User | null>;
  abstract logout(): Observable<void>;
}
