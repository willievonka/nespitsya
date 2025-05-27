import { HttpClient, HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, Observable } from 'rxjs';
import { environment } from '../../environment';


let isRefreshing: boolean = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Adds a callback to be called when the token is refreshed.
 * @param cb Callback function to be called with the new token.
 */
function subscribeTokenRefresh(cb: (token: string) => void): void {
    refreshSubscribers.push(cb);
}

/**
 * Calls all subscriber callbacks with the refreshed token and clears the subscriber list.
 * @param token The new JWT access token.
 */
function onRefreshed(token: string): void {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
}


export const jwtInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
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
            if (error.status === 401 && error.error?.message === 'Недействительный или просроченный токен') {
                const refreshToken: string | null = localStorage.getItem('JWT_Refresh_Token');
                if (refreshToken) {
                    if (!isRefreshing) {
                        isRefreshing = true;

                        return http.post<{ accessToken: string, refreshToken: string }>(`${environment.authUrl}/refresh`, { refreshToken })
                            .pipe(
                                switchMap(response => {
                                    isRefreshing = false;
                                    localStorage.setItem('JWT_Access_Token', response.accessToken);
                                    localStorage.setItem('JWT_Refresh_Token', response.refreshToken);
                                    onRefreshed(response.accessToken);
                                    const newReq: HttpRequest<unknown> = req.clone({
                                        setHeaders: {
                                            Authorization: `Bearer ${response.accessToken}`
                                        }
                                    });

                                    return next(newReq);
                                }),
                                catchError(() => {
                                    isRefreshing = false;
                                    localStorage.removeItem('JWT_Access_Token');
                                    localStorage.removeItem('JWT_Refresh_Token');
                                    router.navigate(['/home']);

                                    return throwError(() => error);
                                })
                            );
                    } else {
                        return new Observable<HttpEvent<unknown>>((observer) => {
                            subscribeTokenRefresh((newToken: string) => {
                                const newReq: HttpRequest<unknown> = req.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${newToken}`
                                    }
                                });
                                next(newReq).subscribe({
                                    next: (event) => observer.next(event),
                                    error: (err) => observer.error(err),
                                    complete: () => observer.complete()
                                });
                            });
                        });
                    }
                }
            }

            return throwError(() => error);
        })
    );
};
