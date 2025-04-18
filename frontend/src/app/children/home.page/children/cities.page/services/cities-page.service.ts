import { Injectable } from '@angular/core';
import { IRegionsGroup } from '../interfaces/regions-group.interface';
import { IPopularCity } from '../interfaces/popular-city.interface';


@Injectable({
    providedIn: 'root',
})
export class CitiesPageService {
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
     * Retrieves the list of popular cities.
     * @returns An array of popular city objects.
     */
    public getPopularCitiesList(): IPopularCity[] {
        return [
            {
                id: 10,
                name: 'Москва',
                shortName: 'МСК',
                backgroundUrl: 'image.png',
            },
            {
                id: 11,
                name: 'Санкт-Петербург',
                shortName: 'СПБ',
                backgroundUrl: 'image.png',
            },
            {
                id: 12,
                name: 'Новосибирск',
                shortName: 'НСК',
                backgroundUrl: 'image.png',
            },
            {
                id: 13,
                name: 'Екатеринбург',
                shortName: 'ЕКБ',
                backgroundUrl: 'image.png',
            },
            {
                id: 14,
                name: 'Нижний Новгород',
                shortName: 'ННВ',
                backgroundUrl: 'image.png',
            },
            {
                id: 15,
                name: 'Казань',
                shortName: 'КЗН',
                backgroundUrl: 'image.png',
            },
        ];
    }

    /**
     * Retrieves the list of regions and their respective cities.
     * @returns An array of region groups with their cities.
     */
    public getRegionsList(): IRegionsGroup[] {
        return [
            {
                name: 'М',
                regions: [
                    {
                        name: 'Московская область',
                        cities: [
                            { id: 1, name: 'Красногорск' },
                            { id: 2, name: 'Химки' },
                            { id: 3, name: 'Зеленоград' },
                        ],
                    },
                ],
            },
            {
                name: 'Л',
                regions: [
                    {
                        name: 'Ленинградская область',
                        cities: [
                            { id: 4, name: 'Пушкин' },
                            { id: 5, name: 'Петергоф' },
                        ],
                    },
                ],
            },
            {
                name: 'С',
                regions: [
                    {
                        name: 'Свердловская область',
                        cities: [
                            { id: 6, name: 'Екатеринбург' },
                            { id: 7, name: 'Ревда' },
                            { id: 8, name: 'Первоуральск' },
                            { id: 9, name: 'Верхняя Пышма' },
                        ],
                    },
                ],
            },
        ];
    }

    /**
     * Retrieves the list of region tab names.
     * @returns An array of region group names.
     */
    public getRegionsTabs(): string[] {
        return this.getRegionsList().map((group: IRegionsGroup) => group.name);
    }
}
