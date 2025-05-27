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
    private readonly _apiUrl: string = environment.apiUrl;

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
     * Changes the username of the specified user.
     * @param user - The user whose username is to be changed.
     * @param newUsername - The new username to set.
     * @returns An observable of the server response as a string.
     */
    public changeUsername(user: IUser, newUsername: string): Observable<string> {
        return this._http.put<string>(`${this._authUrl}/users/${user.id}`, { username: newUsername });
    }

    /**
     * Changes the password of the specified user.
     * @param user - The user whose password is to be changed.
     * @param currentPassword - The user's current password.
     * @param newPassword - The new password to set.
     * @returns An observable of the server response as a string.
     */
    public changePassword(user: IUser, currentPassword: string, newPassword: string): Observable<string> {
        return this._http.put<string>(`${this._authUrl}/users/${user.id}`, {
            oldPassword: currentPassword,
            newPassword: newPassword
        });
    }

    
    /**
     * Retrieves events by their IDs.
     * @param idList - An array of event IDs to fetch.
     * @returns An observable of an array of events.
     */
    public getEventsByIds(idList: number[]): Observable<IEvent[]> {
        return this._http.post<IEvent[]>(`${this._apiUrl}/event/by-ids`, { eventIds: idList });
    }

    /**
     * Adds an event to the user's list of favorites.
     * @param user - The user object containing the user's ID.
     * @param eventId - The ID of the event to add to favorites.
     * @returns An observable of the server response as a string.
     */
    public addToFavorites(user: IUser, eventId: string): Observable<string> {
        return this._http.post<string>(`${this._authUrl}/users/${user.id}/favorites`, { eventId });
    }

    /**
     * Removes an event from the user's list of favorites.
     * @param user - The user object containing the user's ID.
     * @param eventId - The ID of the event to remove from favorites.
     * @returns An observable of the server response as a string.
     */
    public removeFromFavorites(user: IUser, eventId: string): Observable<string> {
        return this._http.delete<string>(`${this._authUrl}/users/${user.id}/favorites`, { body: { eventId } });
    }
}
