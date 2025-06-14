import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { environment } from '../../environments/environment.development';
import { catchError, throwError } from 'rxjs';
import { AccessTokenExpired } from '../state/auth.actions';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.apiOrigin)) {
    const store = inject(Store);
    const authService = inject(AuthService);
    const token = store.selectSnapshot(accessToken);
    if (token) {
      return next(
        req.clone({
          withCredentials: true,
        })
      ).pipe(
        catchError((e: HttpErrorResponse) => {
          if (e.status == 401) {
            store.dispatch(AccessTokenExpired);
          }
          return throwError(() => e);
        })
      );
    }
  }
  return next(req);
};
