import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../children/auth.page/services/auth.service';
import { map, take } from 'rxjs';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    const requiredAuth: boolean = route.data['requiredAuth'] as boolean;

    return authService.isAuthenticated$.pipe(
        take(1),
        map(isAuth => {
            if (isAuth === requiredAuth) {
                return true;
            }

            if (requiredAuth) {
                return router.createUrlTree(['/auth/login']);
            }
            
            return router.createUrlTree(['/account']);
        })
    );
};
