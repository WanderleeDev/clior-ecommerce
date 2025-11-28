import { inject, Injectable } from '@angular/core';
import { RegisterPayload } from '../store/register/models/Register.state';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

interface Credentials {
  email: string;
  password: string;
}

interface AuthLoginSuccess {
  token: string;
  role: 'user' | 'admin';
}

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
    });

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
