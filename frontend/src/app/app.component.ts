import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LayoutDashboard,
  ListCheck,
  ListChecks,
  LogOut,
  LucideAngularModule,
  Settings,
  User,
} from 'lucide-angular';

@Component({
  selector: 'ot-root',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
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
      path: 'todos',
      label: 'All Tasks',
    },
    {
      icon: Settings,
      path: 'settings',
      label: 'Settings',
    },
  ];
  readonly sideMenuOpen = signal(false);
  readonly title = inject(Title);
}
