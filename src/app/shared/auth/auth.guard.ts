import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { map, switchMap, take } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Wait for auth to be initialized before proceeding
  await authService.waitForAuthInitialized();
  
  // Now we can safely check authentication state
  if (authService.isAuthenticated) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};