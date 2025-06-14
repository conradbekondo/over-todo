import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GreetingComponent } from '../../components/greeting/greeting.component';
import { NewTaskComponent } from '../../components/new-task/new-task.component';
import { ClockService } from '../../services/clock.service';

@Component({
  selector: 'ot-todos-page',
  imports: [GreetingComponent, NewTaskComponent],
  templateUrl: './todos-page.component.html',
  styleUrl: './todos-page.component.css',
})
export class TodosPageComponent {
  private readonly clockService = inject(ClockService);
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
}
