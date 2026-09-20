import { Injectable, signal } from '@angular/core';
import type { User } from '../../domain/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly user = signal<User | null>(null);
  readonly current = this.user.asReadonly();

  set(user: User | null): void {
    this.user.set(user);
  }

  clear(): void {
    this.user.set(null);
  }
}
