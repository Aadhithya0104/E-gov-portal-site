import { Routes } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell.component';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardShellComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview',  loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent) },
      { path: 'apply',     loadComponent: () => import('./apply/apply.component').then(m => m.ApplyComponent) },
      { path: 'my-issues', loadComponent: () => import('./my-issues/my-issues.component').then(m => m.MyIssuesComponent) },
      { path: 'updates',   loadComponent: () => import('./updates/updates.component').then(m => m.UpdatesComponent) },
      { path: 'profile',   loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
    ],
  },
];
