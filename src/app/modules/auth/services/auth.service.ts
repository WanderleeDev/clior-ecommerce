import { inject, Injectable } from '@angular/core';
import { Credentials } from '../interfaces/credentials.interface';
import { delay, Observable, of } from 'rxjs';
import { AuthLoginSuccess } from '../interfaces/authResponse.interface';
import { RegisterPayload } from '../store/register/models/Register.state';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #router = inject(Router);
  public login(credentials: Credentials): Observable<AuthLoginSuccess> {
    console.log(credentials);
    return of({
      token: '1234567890',
      role: 'user',
    }).pipe(delay(1000));

    // return timer(3000).pipe(
    //   mergeMap(() =>
    //     throwError(
    //       () =>
    //         new HttpErrorResponse({
    //           status: 400,
    //           statusText: 'Invalid credentials',
    //         }),
    //     ),
    //   ),
    // );
  }

  public async register(data: RegisterPayload) {
    for (const key of Object.keys(data)) {
      if (!data[key as keyof typeof data]) return;
    }

    console.log(data);
    this.#router.navigateByUrl('/auth/login-screen');
  }
}
