import { Injectable } from '@angular/core';
import { dispatch } from '@ngxs/store';
import { createAuthClient } from 'better-auth/client';
import { EMPTY, from, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {
  CredentialSignInRequest,
  CredentialSignUpRequest,
} from '../../models/types';
import { SignedOut } from '../state/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly betterAuth = createAuthClient({
    baseURL: environment.apiOrigin,
  });
  private signedOut = dispatch(SignedOut);

  deleteAccount(password: string) {
    return from(this.betterAuth.deleteUser({ password })).pipe(
      switchMap(({ error, data }) => {
        if (error) {
          if (error.status == 401) {
            this.signedOut('/');
            return EMPTY;
          }
          return throwError(() => error);
        }
        return of(data);
      })
    );
  }

  signOut() {
    return from(this.betterAuth.signOut()).pipe(
      switchMap(({ error, data }) => {
        if (error) {
          if (error.status == 401) {
            this.signedOut('/');
            return EMPTY;
          }
          return throwError(() => error);
        }
        return of(data);
      })
    );
  }

  getSessionInfo() {
    return from(this.betterAuth.getSession()).pipe(
      switchMap(({ error, data }) => {
        if (error) {
          if (error.status == 401) {
            this.signedOut('/');
            return EMPTY;
          }
          return throwError(() => error);
        }
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
