import { DestroyRef, inject, signal } from '@angular/core';
import {
    Actions,
    ActionType,
    ofActionCompleted,
    ofActionDispatched,
} from '@ngxs/store';
import { map, merge } from 'rxjs';

export function isActionLoading(type: ActionType) {
  const action$ = inject(Actions);
  const destroy = inject(DestroyRef);
  const ret = signal<boolean>(false);
  const subscription = merge(
    action$.pipe(
      ofActionDispatched(type),
      map(() => true)
    ),
    action$.pipe(
      ofActionCompleted(type),
      map(() => false)
    )
  ).subscribe((v) => ret.set(v));

  destroy.onDestroy(() => subscription.unsubscribe());

  return ret.asReadonly();
}
