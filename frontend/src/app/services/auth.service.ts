import { Injectable } from '@angular/core';
import { createAuthClient } from 'better-auth/client';
import { from, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  CredentialSignInRequest,
  CredentialSignUpRequest,
} from '../../models/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly betterAuth = createAuthClient({
    baseURL: environment.apiOrigin,
  });

  getSessionInfo() {
    return from(this.betterAuth.getSession()).pipe(
      switchMap(({ error, data }) => {
        if (error) return throwError(() => error);
        return of(data);
      })
    );
  }

  credentialSignIn(
    captchaToken: string,
    { email, password }: CredentialSignInRequest
  ) {
    return from(
      this.betterAuth.signIn.email({
        email,
        password,
        fetchOptions: {
          headers: {
            'x-captcha-response': captchaToken,
          },
        },
      })
    ).pipe(
      switchMap(({ error, data }) => {
        if (error) return throwError(() => error);
        return of(data);
      })
    );
  }
  credentialSignUp(
    captchaToken: string,
    { email, password, names }: CredentialSignUpRequest
  ) {
    return from(
      this.betterAuth.signUp.email({
        name: names,
        email,
        password,
        fetchOptions: {
          headers: {
            'x-captcha-response': captchaToken,
          },
        },
      })
    ).pipe(
      switchMap(({ error, data }) => {
        if (error) return throwError(() => error);
        return of(data);
      })
    );
  }
}
