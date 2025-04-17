import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  await authService.waitForAuthInitialized();

  if (!authService.isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  if (!authService.hasRole(requiredRoles)) {
    if (authService.hasRole('admin')) {
      router.navigate(['/admin/manage-users']);
    } else if (authService.hasRole('teacher')) {
      router.navigate(['/teacher/question-bank']);
    } else {
      router.navigate(['/students/dashboard']);
    }
    return false;
  }

  return true;
};
