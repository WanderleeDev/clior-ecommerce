import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { AuthUsecase } from '../domain/ports/in/auth.usecase';
import { AuthRepositoryPort } from '../domain/ports/out/auth-repository.port';
import { RegistrationRepositoryPort } from '../domain/ports/out/registration-repository.port';
import type { LoginCredentials, RecoverData, RegisterData, RegisterResult, User } from '../domain/models/auth.model';

@Injectable()
export class AuthUseCase extends AuthUsecase {
  private readonly repo = inject(AuthRepositoryPort);
  private readonly registration = inject(RegistrationRepositoryPort);

  override login(credentials: LoginCredentials): Observable<User> {
    return this.repo.login(credentials);
  }

  override register(data: RegisterData): Observable<RegisterResult> {
    return this.registration.register(data);
  }

  override verifyEmail(token: string): Observable<void> {
    return this.registration.verifyEmail(token);
  }

  override resendVerification(email: string): Observable<void> {
    return this.registration.resendVerification(email);
  }

  override recover(data: RecoverData): Observable<void> {
    return this.repo.recover(data);
  }

  override me(): Observable<User | null> {
    return this.repo.currentUser();
  }

  override logout(): Observable<void> {
    return this.repo.logout();
  }
}
