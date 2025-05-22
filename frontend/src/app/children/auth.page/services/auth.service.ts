import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environment';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!localStorage.getItem('JWT_Token'));
    private readonly _authUrl: string = environment.authUrl;
    
    constructor(private _http: HttpClient, private _router: Router) {}

    /**
     * Registers a new user with the provided form data.
     * @param form The form group containing user registration data.
     * @returns An Observable emitting the registration result as a string.
     */
    public signup(form: FormGroup, role: string): Observable<string> {
        const data: Record<string, string> = { ...form.value, role };

        return this._http.post<string>(this._authUrl + '/registration', data);
    }
    
    /**
     * Logs in the user with the provided form data.
     * @param form The form group containing user login data.
     * @returns An Observable emitting a boolean indicating the success of the login.
     */
    public login(form: FormGroup): Observable<boolean> {
        return this._http.post<{ token: string }>(this._authUrl + '/login', form.value)
            .pipe(
                map(response => {
                    localStorage.setItem('JWT_Token', response.token);
                    this.isAuthenticated$.next(true);

                    return true;
                })
            );
    }

    /**
     * Logs out the user by removing the JWT token from local storage.
     */
    public logout(): void {
        localStorage.removeItem('JWT_Token');
        this.isAuthenticated$.next(false);
        if (this._router.url.includes('/account')) {
            this._router.navigate(['/home']);
        }
    }
}
