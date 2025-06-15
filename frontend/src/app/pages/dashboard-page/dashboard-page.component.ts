import { AsyncPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { select } from '@ngxs/store';
import { z } from 'zod';
import { environment } from '../../../environments/environment.development';
import { GreetingComponent } from '../../components/greeting/greeting.component';
import { ClockService } from '../../services/clock.service';
import { principal } from '../../state/selectors';

const StatsSchema = z.object({
  created: z.number(),
  due: z.number(),
  completed: z.number(),
});
type Stats = z.infer<typeof StatsSchema>;

@Component({
  selector: 'ot-dashboard-page',
  imports: [GreetingComponent, PercentPipe, DecimalPipe, AsyncPipe, RouterLink],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent {
  readonly principal = select(principal);
  readonly clockService = inject(ClockService);
  private http = inject(HttpClient);
  readonly stats = rxResource({
    loader: () => {
      return this.http.get<Stats>(`${environment.apiOrigin}/api/tasks/stats`);
    },
  });

  readonly data = computed(() => {
    const stats = this.stats.value();
    if (!stats) return [];
    return Object.entries(stats).map(([k, v]) => ({ name: k, value: v }));
  });
}
