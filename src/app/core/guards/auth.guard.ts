import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/auth/login']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated() && auth.isAdmin()) return true;
  return router.createUrlTree(['/auth/login']);
};

export const citizenGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated() && auth.isCitizen()) return true;
  return router.createUrlTree(['/auth/login']);
};

export const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) return true;
  if (auth.isAdmin()) return router.createUrlTree(['/admin']);
  return router.createUrlTree(['/dashboard']);
};
