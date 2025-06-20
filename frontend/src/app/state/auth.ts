import { inject, Injectable } from '@angular/core';
import {
  Action,
  NgxsOnInit,
  State,
  StateContext,
  StateToken,
} from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { tap } from 'rxjs';
import { Principal } from '../../models/types';
import { AuthService } from '../services/auth.service';
import { CredentialSignIn, CredentialSignUp } from './auth.actions';

export type AuthStateModel = {
  signedIn: boolean;
  userInfo?: Principal;
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
      )
    );
  }

  @Action(CredentialSignUp)
  onCredentialSignUp(_: Context, { input, captchaToken }: CredentialSignUp) {
    return this.authService.credentialSignUp(captchaToken, input);
  }
}
