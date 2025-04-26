import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../../../../../environment';
import { IEvent } from '../../../../../../../interfaces/event.interface';
import { combineLatest, map, Observable } from 'rxjs';
import { ICity } from '../../../../../../../interfaces/city.interface';
import { IOrganizer } from '../../../../../../../interfaces/organizer.interface';
import { IPlace } from '../../../../../../../interfaces/place.interface';


@Injectable({
    providedIn: 'root'
})
export class EventPageService {
    private readonly _apiUrl: string = environment.apiUrl;

    constructor(private _http: HttpClient) {}

    /**
     * Fetches an event by its ID.
     * @param eventId - The ID of the event to fetch.
     * @returns Observable emitting the event details.
     */
    public getEvent(eventId: string): Observable<IEvent> {
        return this._http.get<IEvent>(`${this._apiUrl}/event/${eventId}`);
    }

    /**
     * Fetches a city by its ID.
     * @param cityId - The ID of the city to fetch.
     * @returns Observable emitting the city details.
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

    /**
     * Fetches an organizer by its ID.
     * @param organizerId - The ID of the organizer to fetch.
     * @returns Observable emitting the organizer details.
     */
    public getOrganizer(organizerId: number): Observable<IOrganizer> {
        return this._http.get<IOrganizer>(`${this._apiUrl}/organizer/${organizerId}`);
    }

    
    /**
     * Fetches a place by its ID.
     * @param placeId - The ID of the place to fetch.
     * @returns Observable emitting the place details.
     */
    public getPlace(placeId: number): Observable<IPlace> {
        return this._http.get<IPlace>(`${this._apiUrl}/place/${placeId}`);
    }

    
    
    /**
     * Fetches the address based on longitude and latitude using Yandex Maps API.
     * @param lon - The longitude of the location.
     * @param lat - The latitude of the location.
     * @returns Observable emitting the address as a string.
     */
    public getAddress(lon: number, lat: number): Observable<string> {
        const apiUrl: string = `https://geocode-maps.yandex.ru/v1/?apikey=${environment.yaMapsApiKey}&geocode=${lon},${lat}&format=json`;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this._http.get<any>(apiUrl).pipe(
            map((response) => {
                const address: string = response?.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.metaDataProperty?.GeocoderMetaData?.text;
                
                return address || 'Адрес не найден';
            })
        );
    }
}
