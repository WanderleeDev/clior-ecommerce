import type { Observable } from 'rxjs';
import type { LoginCredentials, RecoverData, RegisterData, User } from '../../models/auth.model';

export abstract class AuthRepositoryPort {
  abstract login(credentials: LoginCredentials): Observable<User>;
  abstract register(data: RegisterData): Observable<User>;
  abstract recover(data: RecoverData): Observable<void>;
  abstract currentUser(): Observable<User | null>;
  abstract logout(): Observable<void>;
}
