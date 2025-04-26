import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../../environment';
import { ICity } from '../../../../../interfaces/city.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IEvent } from '../../../../../interfaces/event.interface';


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

    //[ ] TODO: реализовать фильтры
    /**
     * Fetches events for a specific city by its ID.
     * @param cityId - The ID of the city to fetch events for.
     * @returns An observable containing an array of events.
     */
    public getEvents(cityId: string): Observable<IEvent[]> {
        return this._http.get<IEvent[]>(`${this._apiUrl}/event/city/${cityId}`);
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
