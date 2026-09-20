import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthDomainService {
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  passwordsMatch(password: string, confirm: string): boolean {
    return password.length > 0 && password === confirm;
  }

  isStrongPassword(password: string): boolean {
    return password.length >= 8;
  }
}
