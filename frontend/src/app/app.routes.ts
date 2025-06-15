import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const signedInGuard = authGuard('/auth/connect');

export const routes: Routes = [
  {
    path: 'auth/connect',
    title: 'Connect to your Account',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    canActivate: [signedInGuard],
    path: 'settings',
    title: 'Settings',
    loadComponent: () =>
      import('./pages/settings-page/settings-page.component').then(
        (m) => m.SettingsPageComponent
      ),
  },
  {
    path: 'tasks',
    canActivate: [signedInGuard],
    title: 'All Tasks',
    loadComponent: () =>
      import('./pages/todos-page/todos-page.component').then(
        (m) => m.TodosPageComponent
      ),
  },
  {
    path: 'overview',
    canActivate: [signedInGuard],
    title: 'Overview',
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
  },
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  {
    title: 'Page or resource not found',
    path: '**',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page.component').then(
        ({ NotFoundPageComponent }) => NotFoundPageComponent
      ),
  },
];
