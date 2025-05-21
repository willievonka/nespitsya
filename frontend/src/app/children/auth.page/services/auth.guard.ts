import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    
    return false;
};
