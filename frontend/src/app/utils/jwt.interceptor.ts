import { HttpClient, HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environment';


export const jwtInterceptorFn: HttpInterceptorFn = (req, next) => {
    const http: HttpClient = inject(HttpClient);
    const router: Router = inject(Router);
    
    const token: string | null = localStorage.getItem('JWT_Access_Token');
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                const refreshToken: string | null = localStorage.getItem('JWT_Refresh_Token');
                if (refreshToken) {
                    return http.post<{ accessToken: string, refreshToken: string }>(`${environment.authUrl}/refresh`, { refreshToken })
                        .pipe(
                            switchMap(response => {
                                localStorage.setItem('JWT_Access_Token', response.accessToken);
                                localStorage.setItem('JWT_Refresh_Token', response.refreshToken);
                                const newReq: HttpRequest<unknown> = req.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${response.accessToken}`
                                    }
                                });
                                
                                return next(newReq);
                            }),
                            catchError(() => {
                                localStorage.removeItem('JWT_Access_Token');
                                localStorage.removeItem('JWT_Refresh_Token');
                                router.navigate(['/auth/login']);
                                
                                return throwError(() => error);
                            })
                        );
                }
            }

            return throwError(() => error);
        })
    );
};