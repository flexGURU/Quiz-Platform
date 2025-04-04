import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  await authService.waitForAuthInitialized();
  
  if (!authService.isAuthenticated) {
    console.log('Not authenticated - redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  if (!authService.hasRole(requiredRoles)) {
    console.log('Insufficient permissions - redirecting to default route');
    
    if (authService.hasRole('admin')) {
      router.navigate(['/admin/operations']);
    } else if (authService.hasRole('teacher')) {
      router.navigate(['/teacher/question-bank']);
    } else {
      router.navigate(['/students/dashboard']);
    }
    return false;
  }

  return true;
};