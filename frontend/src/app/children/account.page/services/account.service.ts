import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../../../interfaces/user.interface';
import { environment } from '../../../../environment';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private readonly _authUrl: string = environment.authUrl;

    constructor(private _http: HttpClient) {}
    
    /**
     * Fetches the user information from the server.
     * @returns An observable of the user data.
     */
    public getUser(): Observable<IUser> {
        return this._http.get<IUser>(this._authUrl + '/user');
    }
}
