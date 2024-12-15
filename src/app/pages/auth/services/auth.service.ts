import { Injectable } from '@angular/core';
import { Credentials } from '../interfaces/credentials.interface';
import { delay, Observable, of } from 'rxjs';
import { AuthLoginSuccess } from '../interfaces/authResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
}
