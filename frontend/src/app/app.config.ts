import {
  ApplicationConfig,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import {
  SESSION_STORAGE_ENGINE,
  withNgxsStoragePlugin,
} from '@ngxs/storage-plugin';
import { provideStore } from '@ngxs/store';
import { environment } from '../environments/environment.development';
import { routes } from './app.routes';
import { provideRecaptcha } from './providers';
import { AUTH_STATE, AuthState } from './state/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRecaptcha(environment.captchaKey),
    provideStore(
      [AuthState],
      withNgxsStoragePlugin({
        keys: [{ key: AUTH_STATE, engine: SESSION_STORAGE_ENGINE }],
      }),
      withNgxsLoggerPlugin({ disabled: !isDevMode() })
    ),
  ],
};
