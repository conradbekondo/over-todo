import { inject, Injectable } from '@angular/core';
import {
  Action,
  NgxsOnInit,
  State,
  StateContext,
  StateToken,
} from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { catchError, concatMap, tap, throwError } from 'rxjs';
import { Preferences, Principal } from '../../models/types';
import { AuthService } from '../services/auth.service';
import {
  CredentialSignIn,
  CredentialSignUp,
  DeleteAccount,
  SignedOut,
  SignOut,
} from './auth.actions';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Navigate } from '@ngxs/router-plugin';

export type AuthStateModel = {
  signedIn: boolean;
  userInfo?: Principal;
  preferences?: Preferences;
};
export const AUTH_STATE = new StateToken<AuthStateModel>('auth');
type Context = StateContext<AuthStateModel>;

@State({
  name: AUTH_STATE,
  defaults: { signedIn: false },
})
@Injectable()
export class AuthState implements NgxsOnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  @Action(DeleteAccount)
  onDeleteAccount(ctx: Context, { password }: DeleteAccount) {
    return this.authService.deleteAccount(password).pipe(
      tap(({ message, success }) => {
        if (!success) return;
        alert(message);
        ctx.dispatch(new SignedOut('/'));
      })
    );
  }

  @Action(SignedOut)
  onSignedOut(ctx: Context, { redirect }: SignedOut) {
    ctx.setState({ signedIn: false });
    ctx.dispatch(new Navigate([redirect ?? '/']));
    // .subscribe(() => location.reload());
  }

  @Action(SignOut)
  onSignOut(ctx: Context) {
    return this.authService.signOut().pipe(
      tap(({ success }) => {
        if (!success) return;
        ctx.dispatch(new SignedOut('/'));
      })
    );
  }

  ngxsOnInit(ctx: Context): void {
    this.authService.getSessionInfo().pipe(
      tap(({ user: { email, name, id, image } }) =>
        ctx.setState(
          patch({
            signedIn: true,
            userInfo: patch({
              names: name,
              id,
              avatar: image ?? undefined,
              email,
            }),
          })
        )
      )
    );
  }

  @Action(CredentialSignIn)
  onCredentialSignIn(ctx: Context, { captchaToken, input }: CredentialSignIn) {
    return this.authService.credentialSignIn(captchaToken, input).pipe(
      tap(({ user: { email, name, id, image } }) =>
        ctx.setState(
          patch({
            signedIn: true,
            userInfo: patch({
              names: name,
              id,
              avatar: image ?? undefined,
              email,
            }),
          })
        )
      ),
      concatMap(() =>
        this.http
          .get<Preferences>(`${environment.apiOrigin}/api/preferences`)
          .pipe(
            catchError((e: HttpErrorResponse) => throwError(() => e.error ?? e))
          )
      ),
      tap((p) => ctx.setState(patch({ preferences: p })))
    );
  }

  @Action(CredentialSignUp)
  onCredentialSignUp(_: Context, { input, captchaToken }: CredentialSignUp) {
    return this.authService.credentialSignUp(captchaToken, input);
  }
}
