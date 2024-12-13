import { Injectable } from '@angular/core';
import { Credentials } from '../interfaces/credentials.interface';
import { delay, Observable, of } from 'rxjs';
import { AuthLoginSuccess } from '../interfaces/authResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login(credentials: Credentials): Observable<AuthLoginSuccess> {
    console.log(credentials);

    return of({
      token: '1234567890',
      role: 'admin',
    }).pipe(delay(1000));
  }
}
