import { Injectable } from '@angular/core';
import { ICity } from '../interfaces/city.interface';
import { IEvent } from '../interfaces/event.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment';
import { GeolocationService } from '@ng-web-apis/geolocation';


@Injectable({
    providedIn: 'root',
})
export class HomePageService {
    // [ ] TODO: сделать получение города по координатам из апи геолокации
    private _cityId: number = 14; // - заглушка, пока не сделаем получение города по координатам из апи геолокации

    private readonly _apiUrl: string = environment.apiUrl; // - тру апи
    //private readonly _apiUrl: string = 'mock-data'; // - фейк апи

    constructor(private _http: HttpClient, private readonly _geolocation$: GeolocationService) {}

    /**
     * Gets the city data from the API.
     * @returns {Observable<ICity>} An observable of the city data.
     */
    public getCity(): Observable<ICity> {
        return this._http.get<ICity>(`${this._apiUrl}/cities/${this._cityId}`);
    }

    /**
     * Gets the events data for a specific city from the API.
     * @param {number} cityId - The ID of the city.
     * @returns {Observable<IEvent[]>} An observable of the events data.
     */
    public getEvents(cityId: number): Observable<IEvent[]> {
        return this._http.get<IEvent[]>(`${this._apiUrl}/event/city/${cityId}`);
    }
}