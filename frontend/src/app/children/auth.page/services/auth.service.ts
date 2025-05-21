import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environment';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public isLoggenIn: boolean = false;
    private readonly _authUrl: string = environment.authUrl;
    
    constructor(private _http: HttpClient) {}

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
     * Logs in a user with the provided form data.
     * @param form The form group containing user login data.
     * @returns An Observable emitting true if login is successful, otherwise throws an error.
     */
    public login(form: FormGroup): Observable<boolean> {
        interface ILoginResponse {
            token: string;
        }

        return this._http.post<ILoginResponse>(this._authUrl + '/login', form.value)
            .pipe(
                map(response => {
                    localStorage.setItem('JWT_Token', response.token);
                    this.isLoggenIn = true;

                    return true;
                }),
                catchError(error => {
                    this.isLoggenIn = false;
                    
                    return throwError(() => error);
                })
            );
    }

    /**
     * Logs out the current user by removing the JWT token and updating the login status.
     */
    public logout(): void {
        localStorage.removeItem('JWT_Token');
        this.isLoggenIn = false;
    }
}
