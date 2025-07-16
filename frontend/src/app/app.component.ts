import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { dispatch, select } from '@ngxs/store';
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
import { map } from 'rxjs';
import { ClockService } from './services/clock.service';
import { isUserSignedIn, principal } from './state/selectors';
import { SignOut } from './state/auth.actions';

@Component({
  selector: 'ot-root',
  imports: [
    RouterLink,
    // NgxSonnerToaster,
    RouterLinkActive,
    LucideAngularModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private observer = inject(BreakpointObserver);
  isHandheld = toSignal(
    this.observer.observe(Breakpoints.Handset).pipe(map((s) => s.matches))
  );
  Bell = Bell;
  User = User;
  ListCheck = ListCheck;
  Settings = Settings;
  LogOut = LogOut;
  routes = [
    {
      icon: LayoutDashboard,
      path: 'overview',
      label: 'Overview',
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
  readonly principal = select(principal);
  private signOut = dispatch(SignOut);

  onSignOutButtonClicked() {
    this.signOut().subscribe({
      error: (e: Error) => alert(e.message),
    });
  }
}
