import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../../../../environment';
import { IEvent } from '../../../../../../../interfaces/event.interface';
import { combineLatest, map, Observable } from 'rxjs';
import { ICity } from '../../../../../../../interfaces/city.interface';


@Injectable({
    providedIn: 'root'
})
export class EventPageService {
    private readonly _apiUrl: string = environment.apiUrl;

    constructor(private _http: HttpClient) {}

    /**
     *
     */
    public getEvent(eventId: string): Observable<IEvent> {
        return this._http.get<IEvent>(`${this._apiUrl}/event/${eventId}`);
    }

    /**
     *
     */
    public getCity(cityId: string): Observable<ICity> {
        return this._http.get<ICity>(`${this._apiUrl}/cities/${cityId}`);
    }


    /**
     * Generates breadcrumbs for navigation based on the provided city and event observables.
     * @param city - Observable emitting the city details.
     * @param event - Observable emitting the event details.
     * @returns Observable emitting an array of breadcrumb objects with captions and router links.
     */
    public getBreadcrumbs(
        city: Observable<ICity>, 
        event: Observable<IEvent>
    ): Observable<Array<{ caption: string; routerLink: string }>> {
        return combineLatest([city, event]).pipe(
            map(([c, e]: [ICity, IEvent]) => [
                { caption: 'Главная', routerLink: '/home' },
                { caption: 'Города', routerLink: '/home/cities' },
                { caption: c.name, routerLink: `/home/cities/${c.id}` },
                { caption: e.title, routerLink: `/home/cities/${c.id}/${e.id}` }
            ])
        );
    }
}
