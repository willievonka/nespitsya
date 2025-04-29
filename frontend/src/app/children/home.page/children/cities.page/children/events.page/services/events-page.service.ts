import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../../environment';
import { ICity } from '../../../../../interfaces/city.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { TEventsList } from '../types/events-list.type';


@Injectable({
    providedIn: 'root'
})
export class EventsPageService {
    private readonly _apiUrl: string = environment.apiUrl;

    constructor(private _http: HttpClient) {}

    /**
     * Fetches a city by its ID.
     * @param cityId - The ID of the city to fetch.
     * @returns An observable containing the city data.
     */
    public getCity(cityId: string): Observable<ICity> {
        return this._http.get<ICity>(`${this._apiUrl}/cities/${cityId}`);
    }

    /**
     * Fetches events for a specific city by its ID.
     * @param cityId - The ID of the city to fetch events for.
     * @returns An observable containing an array of events.
     */
    public getEvents(cityId: string): Observable<TEventsList> {
        return this._http.get<TEventsList>(`${this._apiUrl}/event/date?cityId=${cityId}`).pipe(
            catchError(e => {
                if (e.status === 404) {
                    return of([]);
                }
                throw e;
            })
        );
    }


    /**
     * Generates breadcrumbs for navigation based on the provided city.
     * @param city - An observable containing the city data.
     * @returns An observable containing an array of breadcrumb objects.
     */
    public getBreadcrumbs(city: Observable<ICity>): Observable<Array<{ caption: string; routerLink: string }>> {
        return city.pipe(
            map(c => [
                {
                    caption: 'Главная',
                    routerLink: '/home',
                },
                {
                    caption: 'Города',
                    routerLink: '/home/cities',
                },
                {
                    caption: c.name,
                    routerLink: `/home/cities/${c.id}`,
                },
            ])
        );
    }
}
