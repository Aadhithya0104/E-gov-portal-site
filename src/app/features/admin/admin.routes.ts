import { Routes } from '@angular/router';
import { AdminShellComponent } from './admin-shell.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview',  loadComponent: () => import('./overview/admin-overview.component').then(m => m.AdminOverviewComponent) },
      { path: 'issues',    loadComponent: () => import('./issues/admin-issues.component').then(m => m.AdminIssuesComponent) },
      { path: 'pending',   loadComponent: () => import('./pending/admin-pending.component').then(m => m.AdminPendingComponent) },
      { path: 'completed', loadComponent: () => import('./completed/admin-completed.component').then(m => m.AdminCompletedComponent) },
    ],
  },
];
