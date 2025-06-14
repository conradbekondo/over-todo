import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  Bell,
  LayoutDashboard,
  ListCheck,
  ListChecks,
  LogOut,
  LucideAngularModule,
  Settings,
  User,
} from 'lucide-angular';
import { ClockService } from './services/clock.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { select } from '@ngxs/store';
import { isUserSignedIn } from './state/selectors';

@Component({
  selector: 'ot-root',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  Bell = Bell;
  User = User;
  ListCheck = ListCheck;
  Settings = Settings;
  LogOut = LogOut;
  routes = [
    {
      icon: LayoutDashboard,
      path: 'dashboard',
      label: 'Dashboard',
    },
    {
      icon: ListChecks,
      path: 'tasks',
      label: 'All Tasks',
    },
    {
      icon: Bell,
      path: 'notifications',
      label: 'Notifications',
    },
    {
      icon: Settings,
      path: 'settings',
      label: 'Settings',
    },
  ];
  readonly sideMenuOpen = signal(false);
  private readonly clockService = inject(ClockService);
  readonly currentTime = toSignal(this.clockService.currentTime$);
  readonly title = inject(Title);
  readonly signedIn = select(isUserSignedIn);
}
