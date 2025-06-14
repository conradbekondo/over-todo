import {
  CredentialSignInRequest,
  CredentialSignUpRequest,
} from '../../models/types';

const prefix = '[auth]';
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

export class AccessTokenExpired {
  static type = `${prefix} signed out`;
}
