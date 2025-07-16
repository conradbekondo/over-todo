import {
  CredentialSignInRequest,
  CredentialSignUpRequest,
} from '../../models/types';

const prefix = '[auth]';

export class DeleteAccount {
  static type = `${prefix} delete account`;
  constructor(readonly password: string) {}
}
export class SignOut {
  static type = `${prefix} sign out`;
}
export class CredentialSignIn {
  static type = `${prefix} credential sign in`;
  constructor(
    readonly captchaToken: string,
    readonly input: CredentialSignInRequest
  ) {}
}

export class CredentialSignUp {
  static type = `${prefix} credential sign up`;
  constructor(
    readonly captchaToken: string,
    readonly input: CredentialSignUpRequest
  ) {}
}

export class SignedOut {
  static type = `${prefix} signed out`;
  constructor(readonly redirect?: string) {}
}
