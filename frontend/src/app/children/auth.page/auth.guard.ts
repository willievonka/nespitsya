import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const isAuthenticated: boolean = inject(AuthService).isLoggenIn;
    const router: Router = inject(Router);

    if (isAuthenticated) {
        return true;
    }
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    
    return false;
};
