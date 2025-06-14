import { inject } from '@angular/core';
import {
  CanActivateFn,
  createUrlTreeFromSnapshot,
  Router,
} from '@angular/router';
import { Store } from '@ngxs/store';
import { isUserSignedIn } from '../state/selectors';

export const authGuard: (r: string) => CanActivateFn =
  (redirect: string) => (route, state) => {
    const store = inject(Store);
    const router = inject(Router);
    const signedIn = store.selectSnapshot(isUserSignedIn);

    return signedIn
      ? true
      : router.createUrlTree([redirect], {
          queryParams: { continue: encodeURIComponent(state.url) },
          queryParamsHandling: 'merge',
        });
  };
