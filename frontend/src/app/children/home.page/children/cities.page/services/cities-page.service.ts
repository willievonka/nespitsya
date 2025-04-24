import { Injectable } from '@angular/core';
import { IRegionsGroup } from '../interfaces/regions-group.interface';
import { IPopularCity } from '../interfaces/popular-city.interface';
import { environment } from '../../../../../../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class CitiesPageService {
    private readonly _apiUrl: string = environment.apiUrl;

    constructor(private _http: HttpClient) {}

    /**
     * Retrieves the breadcrumbs for the cities page.
     * @returns An array of breadcrumb objects with captions and router links.
     */
    public getBreadcrumbs(): Array<{ caption: string; routerLink: string }> {
        return [
            { caption: 'Главная', routerLink: '/home' },
            { caption: 'Города', routerLink: '/home/cities' },
        ];
    }

    /**
     *
     */
    public getPopularCitiesList(): Observable<IPopularCity[]> {
        //[ ] TODO: сделать получение списка популярных городов из апи
        return this._http.get<IPopularCity[]>(`mock-data/popular-cities.json`);
    }

    
    /**
     * Retrieves the list of regions grouped by categories.
     * @returns An observable of an array of region groups.
     */
    public getRegionsList(): Observable<IRegionsGroup[]> {
        return this._http.get<IRegionsGroup[]>(`${this._apiUrl}/cities`);
    }

    
    /**
     * Extracts the names of regions from the provided list of region groups.
     * @param regionsList - An array of region groups.
     * @returns An array of region names.
     */
    public getRegionsTabs(regionsList: IRegionsGroup[]): string[] {
        return regionsList.map((group: IRegionsGroup) => group.name);
    }
}
