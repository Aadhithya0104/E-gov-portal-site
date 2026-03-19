import { Routes } from '@angular/router';
import { authGuard, adminGuard, citizenGuard, loginGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'auth',
    canActivate: [loginGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'dashboard',
    canActivate: [citizenGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
  },
  { path: '**', redirectTo: 'home' },
];
