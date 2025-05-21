import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


export class JwtInterceptor implements HttpInterceptor {
    /**
     * Intercepts HTTP requests to add a JWT token to the Authorization header if available.
     * @param req The outgoing HTTP request.
     * @param next The next handler in the HTTP request chain.
     * @returns An observable of the HTTP event.
     */
    public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token: string | null = localStorage.getItem('JWT_Token');
        if (token) {
            const authReq: HttpRequest<unknown> = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });

            return next.handle(authReq);
        }

        return next.handle(req);
    }
}
