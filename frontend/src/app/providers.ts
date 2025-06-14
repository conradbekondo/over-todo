import { makeEnvironmentProviders } from '@angular/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

export function provideRecaptcha(key: string) {
  return makeEnvironmentProviders([
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: key },
  ]);
}
