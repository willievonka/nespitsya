import { Injectable } from '@angular/core';
import { ICity } from '../interfaces/city.interface';
import { IEvent } from '../interfaces/event.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class HomePageService {
    /**
     * Observable stream of the current city data.
     * @returns {Observable<ICity>} An observable of the city.
     */
    public get city$() : Observable<ICity> {
        return this._city$;
    }

    /**
     * Observable stream of the events data.
     * @returns {Observable<IEvent[]>} An observable of the events.
     */
    public get events$() : Observable<IEvent[]> {
        return this._events$;
    }
    
    // [ ] TODO: сделать получение города по координатам из апи геолокации
    private _city$: Observable<ICity>;
    private _events$: Observable<IEvent[]>;

    //private readonly _apiUrl: string = 'https://pointedly-exultant-monarch.cloudpub.ru'; - тру апи
    private readonly _apiUrl: string = 'mock-data'; // - фейк апи

    constructor(private _http: HttpClient) {
        this._city$ = this.loadCity();
        this._events$ = this.city$.pipe(
            map(city => city.id),
            switchMap(cityId => this.loadEvents(cityId))
        );
    }

    /**
     * Loads the city data from the API.
     * @returns {Observable<ICity>} An observable of the city data.
     */
    private loadCity(): Observable<ICity> {
        return this._http.get<ICity>(`${this._apiUrl}/city.json`);
    }

    /**
     * Loads the events data for a specific city from the API.
     * @param {number} cityId - The ID of the city.
     * @returns {Observable<IEvent[]>} An observable of the events data.
     */
    private loadEvents(cityId: number): Observable<IEvent[]> {
        return this._http.get<IEvent[]>(`${this._apiUrl}/${cityId}/events.json`);
    }
}