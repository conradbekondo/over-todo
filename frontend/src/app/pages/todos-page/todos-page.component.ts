import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { select } from '@ngxs/store';
import { map, mergeMap, toArray } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { TaskSchema } from '../../../models/schemas';
import { Task } from '../../../models/types';
import { GreetingComponent } from '../../components/greeting/greeting.component';
import { NewTaskComponent } from '../../components/new-task/new-task.component';
import {
  TaskComponent,
  ToggleGroup,
} from '../../components/task/task.component';
import { ClockService } from '../../services/clock.service';
import { principal } from '../../state/selectors';
import { task } from 'better-auth/client';

@Component({
  selector: 'ot-todos-page',
  imports: [GreetingComponent, NewTaskComponent, TaskComponent],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.css',
})
export class TodosPageComponent {
  private readonly http = inject(HttpClient);
  private readonly clockService = inject(ClockService);
  readonly principal = select(principal);
  readonly timeOfDay = toSignal(
    this.clockService.currentTime$.pipe(
      map((time) => {
        if (time.getHours() >= 19 || time.getHours() < 5) return 'night';
        else if (time.getHours() < 12) return 'morning';
        else if (time.getHours() < 16) return 'afternoon';
        else return 'evening';
      })
    )
  );
  readonly tasks = rxResource({
    loader: () => {
      return this.http.get(`${environment.apiOrigin}/api/tasks`).pipe(
        mergeMap((v) => v as Task[]),
        map((t) => TaskSchema.parse(t)),
        toArray()
      );
    },
  });
  readonly pendingTasks = computed(() => {
    const tasks = this.tasks.value();
    if (!tasks) return [];
    return tasks.filter((t) => !t.completed);
  });
  readonly completedTasks = computed(() => {
    const tasks = this.tasks.value();
    if (!tasks) return [];
    return tasks.filter((t) => t.completed);
  });
  readonly tg = new ToggleGroup();
  private readonly changeRef = inject(ChangeDetectorRef);
  onCompletionStatusChanged(t: Task, v: boolean) {
    const prev = t.completed;
    t.completed = v;
    this.http
      .patch(`${environment.apiOrigin}/api/tasks/completion-status/${t.id}`, {
        status: v,
      })
      .subscribe({
        error: (e: HttpErrorResponse) => {
          alert(e.error?.message ?? e.message);
          t.completed = prev;
          this.changeRef.markForCheck();
        },
        complete: () => {
          this.tasks.reload();
          this.changeRef.markForCheck();
        },
      });
  }
}
