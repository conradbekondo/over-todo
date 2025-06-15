import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { select } from '@ngxs/store';
import {
  CircleChevronDown,
  CircleChevronUp,
  LucideAngularModule,
} from 'lucide-angular';
import { map } from 'rxjs';
import z from 'zod';
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

const PaginationSchema = z
  .object({
    data: TaskSchema.array(),
    total: z.number(),
    size: z.number(),
    page: z.number(),
  })
  .transform((v) => {
    const totalPages = Math.ceil(v.total / v.size);
    return { ...v, totalPages };
  });

@Component({
  selector: 'ot-todos-page',
  imports: [
    GreetingComponent,
    NewTaskComponent,
    TaskComponent,
    LucideAngularModule,
  ],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.css',
})
export class TodosPageComponent {
  ChevronDown = CircleChevronDown;
  ChevronUp = CircleChevronUp;
  private readonly http = inject(HttpClient);
  readonly page = signal(0);
  readonly pageSize = 10;
  private readonly clockService = inject(ClockService);
  readonly principal = select(principal);
  readonly timeOfDay = toSignal(this.clockService.timeOfDay$);
  readonly tasks = rxResource({
    request: this.page,
    loader: ({ request }) => {
      return this.http
        .get(`${environment.apiOrigin}/api/tasks`, {
          params: {
            page: request,
            limit: this.pageSize,
          },
        })
        .pipe(map((t) => PaginationSchema.parse(t)));
    },
  });
  readonly pendingTasks = computed(() => {
    const tasks = this.tasks.value()?.data;
    if (!tasks) return [];
    return tasks.filter((t) => !t.completed);
  });
  readonly completedTasks = computed(() => {
    const tasks = this.tasks.value()?.data;
    if (!tasks) return [];
    return tasks.filter((t) => t.completed);
  });
  readonly hasNextPage = computed(() => {
    const v = this.tasks.value();
    return v ? this.page() < v.totalPages - 1 : false;
  });
  readonly hasPrevPage = computed(() => {
    const v = this.tasks.value();
    return v ? this.page() > 0 : false;
  });
  readonly tg = new ToggleGroup();
  private readonly changeRef = inject(ChangeDetectorRef);
  deleteTask(t: Task) {
    this.http.delete(`${environment.apiOrigin}/api/tasks/${t.id}`).subscribe({
      error: (e: HttpErrorResponse) => {
        alert(e.error?.message ?? e.message);
      },
      complete: () => this.tasks.reload(),
    });
  }
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

  onPrevButtonClicked() {
    this.page.update((v) => {
      const vv = Math.max(v - 1, 0);
      return vv;
    });
  }

  onNextButtonClicked() {
    this.page.update((v) => {
      const vv = Math.min(v + 1, this.tasks.value()?.totalPages ?? 0);
      return vv;
    });
  }
}
