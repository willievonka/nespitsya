import { HttpInterceptorFn } from '@angular/common/http';


export const jwtInterceptorFn: HttpInterceptorFn = (req, next) => {
    const token: string | null = localStorage.getItem('JWT_Token');
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req);
};