import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LayoutDashboard,
  ListCheck,
  ListChecks,
  LogOut,
  LucideAngularModule,
  Settings,
} from 'lucide-angular';

@Component({
  selector: 'ot-root',
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
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
  ];
  readonly sideMenuOpen = signal(false);
}
