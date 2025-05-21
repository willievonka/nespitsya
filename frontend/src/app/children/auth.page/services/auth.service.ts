import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environment';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
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
     * Logs in the user with the provided form data.
     * @param form The form group containing user login data.
     * @returns An Observable emitting a boolean indicating the success of the login.
     */
    public login(form: FormGroup): Observable<boolean> {
        interface ILoginResponse {
            token: string;
        }

        return this._http.post<ILoginResponse>(this._authUrl + '/login', form.value)
            .pipe(
                map(response => {
                    localStorage.setItem('JWT_Token', response.token);

                    return true;
                })
            );
    }

    /**
     * Logs out the user by removing the JWT token from local storage.
     */
    public logout(): void {
        localStorage.removeItem('JWT_Token');
    }

    /**
     * Checks if the user is authenticated by verifying the presence of a JWT token in local storage.
     * @returns A boolean indicating whether the user is authenticated.
     */
    public isAuthenticated(): boolean {
        return !!localStorage.getItem('JWT_Token');
    }
}
