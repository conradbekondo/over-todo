import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'settings',
    title: 'Settings',
    loadComponent: () =>
      import('./pages/settings-page/settings-page.component').then(
        (m) => m.SettingsPageComponent
      ),
  },
  {
    path: 'todos',
    title: 'All Tasks',
    loadComponent: () =>
      import('./pages/todos-page/todos-page.component').then(
        (m) => m.TodosPageComponent
      ),
  },
  {
    path: 'dashboard',
    title: 'Overview',
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    title: 'Resource not found',
    path: '**',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page.component').then(
        ({ NotFoundPageComponent }) => NotFoundPageComponent
      ),
  },
];
