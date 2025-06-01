import { HttpClient, HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, Observable, Subscription, interval } from 'rxjs';
import { environment } from '../../environment';


let isRefreshing: boolean = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let refreshTimer: Subscription | null = null;
const refreshInterval: number = 14 * 60 * 1000;

/** Добавляет колбэк, который вызовется после обновления токена */
function subscribeTokenRefresh(cb: (token: string) => void): void {
    refreshSubscribers.push(cb);
}

/** Вызывает все колбэки после обновления токена */
function onRefreshed(token: string): void {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
}

/** Получить access токен из localStorage */
function getAccessToken(): string | null {
    return localStorage.getItem('JWT_Access_Token');
}

/** Получить refresh токен из localStorage */
function getRefreshToken(): string | null {
    return localStorage.getItem('JWT_Refresh_Token');
}

/** Сохранить новые токены */
function saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('JWT_Access_Token', accessToken);
    localStorage.setItem('JWT_Refresh_Token', refreshToken);
}

/** Очистить токены */
function clearTokens(): void {
    localStorage.removeItem('JWT_Access_Token');
    localStorage.removeItem('JWT_Refresh_Token');
}

/** Запустить фоновый авто-рефреш токена */
function startAutoRefresh(http: HttpClient, router: Router): void {
    if (refreshTimer) {
        refreshTimer.unsubscribe();
    }

    refreshTimer = interval(refreshInterval).subscribe(() => {
        const refreshToken: string | null = getRefreshToken();
        if (!refreshToken) {
            return;
        }

        http.post<{ accessToken: string, refreshToken: string }>(
            `${environment.authUrl}/refresh`, { refreshToken }
        ).subscribe({
            next: (response) => {
                saveTokens(response.accessToken, response.refreshToken);
            },
            error: () => {
                clearTokens();
                router.navigate(['/home']);
            }
        });
    });
}

export const jwtInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const http: HttpClient = inject(HttpClient);
    const router: Router = inject(Router);

    if (!refreshTimer) {
        startAutoRefresh(http, router);
    }

    const token: string | null = getAccessToken();
    if (token) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && error.error?.message === 'Недействительный или просроченный токен') {
                const refreshToken: string | null = getRefreshToken();
                if (!refreshToken) {
                    clearTokens();
                    router.navigate(['/home']);

                    return throwError(() => error);
                }

                if (!isRefreshing) {
                    isRefreshing = true;

                    return http.post<{ accessToken: string, refreshToken: string }>(
                        `${environment.authUrl}/refresh`, { refreshToken }
                    ).pipe(
                        switchMap(response => {
                            isRefreshing = false;
                            saveTokens(response.accessToken, response.refreshToken);
                            onRefreshed(response.accessToken);

                            const newReq: HttpRequest<unknown> = req.clone({
                                setHeaders: { Authorization: `Bearer ${response.accessToken}` }
                            });

                            return next(newReq);
                        }),
                        catchError(() => {
                            isRefreshing = false;
                            clearTokens();
                            router.navigate(['/home']);

                            return throwError(() => error);
                        })
                    );
                } else {
                    return new Observable<HttpEvent<unknown>>(observer => {
                        subscribeTokenRefresh((newToken: string) => {
                            const newReq: HttpRequest<unknown> = req.clone({
                                setHeaders: { Authorization: `Bearer ${newToken}` }
                            });
                            next(newReq).subscribe(observer);
                        });
                    });
                }
            }

            return throwError(() => error);
        })
    );
};