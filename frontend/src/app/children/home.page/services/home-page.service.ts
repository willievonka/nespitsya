import { Injectable } from '@angular/core';
import { ICity } from '../interfaces/city.interface';
import { IEvent } from '../interfaces/event.interface';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, Observable, switchMap, take } from 'rxjs';
import { environment } from '../../../../environment';
import { GeolocationService } from '@ng-web-apis/geolocation';


@Injectable({
    providedIn: 'root',
})
export class HomePageService {
    private readonly _apiUrl: string = environment.apiUrl;
    private _cityCoordinates$: BehaviorSubject<{ lon: number; lat: number }> = 
        new BehaviorSubject<{ lon: number; lat: number }>({
            lon: 37.6156,
            lat: 55.7522,
        });
    private _coordinatesReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private _http: HttpClient, private readonly _geolocation$: GeolocationService) {
        this._geolocation$.pipe(take(1)).subscribe((position: GeolocationPosition) => {
            this._cityCoordinates$.next({ lon: position.coords.longitude, lat: position.coords.latitude });
            this._coordinatesReady$.next(true);
        });
    }

    /**
     * Gets the nearest city based on the current coordinates.
     * @returns {Observable<ICity>} An observable of the nearest city data.
     */
    public getCity(): Observable<ICity> {
        return this._coordinatesReady$.pipe(
            filter(ready => ready), 
            take(1), 
            switchMap(() => this._cityCoordinates$), 
            switchMap(coords => this._http.get<ICity>(`${this._apiUrl}/cities/nearest?lon=${coords.lon}&lat=${coords.lat}`))
        );
    }

    /**
     * Gets the events data for a specific city from the API.
     * @param {number} cityId - The ID of the city.
     * @returns {Observable<IEvent[]>} An observable of the events data.
     */
    public getEvents(cityId: number): Observable<IEvent[]> {
        return this._http.get<IEvent[]>(`${this._apiUrl}/event/city/${cityId}?countEvents=9`);
    }
}