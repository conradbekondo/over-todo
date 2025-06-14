import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  CredentialSignInRequest,
  CredentialSignUpRequest,
} from '../../models/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  storeToken(token: string, name: string) {
    if (isDevMode()) {
      sessionStorage.setItem(name, token);
    } else {
      
    }
  }

  credentialSignIn(captchaToken: string, input: CredentialSignInRequest) {
    return this.http
      .post<{ access: string; refresh: string }>(
        `${environment.apiOrigin}/api/auth/email/sign-in`,
        input,
        {
          headers: { 'x-recaptcha-token': captchaToken },
        }
      )
      .pipe(
        catchError((e: HttpErrorResponse) => throwError(() => e.error ?? e))
      );
  }
  credentialSignUp(captchaToken: string, input: CredentialSignUpRequest) {
    return this.http
      .post(`${environment.apiOrigin}/api/auth/email/sign-up`, input, {
        headers: {
          'x-recaptcha-token': captchaToken,
        },
      })
      .pipe(
        catchError((e: HttpErrorResponse) => throwError(() => e.error ?? e))
      );
  }
}
