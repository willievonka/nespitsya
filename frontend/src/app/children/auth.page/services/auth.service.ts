import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
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
    public signup(form: FormGroup): Observable<string> {
        const data: { [key: string]: string; role: string } = { ...form.value, role: 'user' };

        return this._http.post<string>(this._authUrl + '/registration', data);
    }
}
