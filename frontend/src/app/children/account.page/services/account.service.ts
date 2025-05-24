import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../../../interfaces/user.interface';
import { environment } from '../../../../environment';
import { Observable } from 'rxjs';
import { IEvent } from '../../home.page/interfaces/event.interface';


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

    
    /**
     * Generates a list of tabs based on the user's role.
     * @param user - The user object containing role information.
     * @returns An array of tab objects with name, icon, and route properties.
     */
    public getTabs(user: IUser): Array<{name: string, icon: string, route: string}> {
        const tabs: Array<{name: string, icon: string, route: string}> = [];
        tabs.push({ name: 'Аккаунт', icon: 'circle-user', route: '/account/profile' });
        switch (user.role) {
            case 'user':
                tabs.push({ name: 'Избранные', icon: 'heart', route: '/account/favorites' });
                tabs.push({ name: 'Подписки', icon: 'users', route: '/account/subscriptions' });
                break;
            case 'organizer':
                tabs.push({ name: 'Мои мероприятия', icon: 'heart', route: '/account/my-events' });
                tabs.push({ name: 'Создать мероприятие', icon: 'circle-plus', route: '/account/create-event' });
                break;
            case 'admin':
                break;
        }

        return tabs;
    }

    /**
     * Fetches the list of favorite events for a specific user.
     * @param user - The user object containing the user's ID.
     * @returns An observable of an array of favorite events.
     */
    public getFavorites(user: IUser): Observable<IEvent[]> {
        return this._http.get<IEvent[]>(`${this._authUrl}/${user.id}/favorites`);
    }
}
