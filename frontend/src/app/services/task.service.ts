import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NewTodoRequest } from '../../models/types';
import { environment } from '../../environments/environment.development';
import { catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);

  createTask(input: NewTodoRequest) {
    return this.http.post(`${environment.apiOrigin}/api/tasks`, input).pipe(
      catchError((e: HttpErrorResponse) => {
        return throwError(() => {
          return e.error ?? e;
        });
      })
    );
  }
}
