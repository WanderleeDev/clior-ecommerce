import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { AuthUsecase } from '../domain/ports/in/auth.usecase';
import { AuthRepositoryPort } from '../domain/ports/out/auth-repository.port';
import type { LoginCredentials, RecoverData, RegisterData, User } from '../domain/models/auth.model';

@Injectable()
export class AuthUseCase extends AuthUsecase {
  constructor(private readonly repo: AuthRepositoryPort) {
    super();
  }

  override login(credentials: LoginCredentials): Observable<User> {
    return this.repo.login(credentials);
  }

  override register(data: RegisterData): Observable<User> {
    return this.repo.register(data);
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
