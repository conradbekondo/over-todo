import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { SignedOut } from '../state/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith(environment.apiOrigin)) {
    const store = inject(Store);
    return next(
      req.clone({
        withCredentials: true,
      })
    ).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.status == 401) {
          store.dispatch(SignedOut);
        }
        return throwError(() => e);
      })
    );
  }
  return next(req);
};
