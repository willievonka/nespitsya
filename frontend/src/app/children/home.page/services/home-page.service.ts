import { Injectable } from '@angular/core';
import { ICity } from '../interfaces/city.interface';
import { IEvent } from '../interfaces/event.interface';

@Injectable({
    providedIn: 'root',
})
export class HomePageService {
    /**
     * Retrieves the city information.
     * @returns {ICity} The city object containing id and name.
     */
    public getCity(): ICity {
        return {
            id: 6,
            name: 'Екатеринбург',
        };
    }

    /**
     * Retrieves a list of events.
     * @returns {IEvent[]} An array of event objects.
     */
    public getEvents(): IEvent[] {
        return [
            {
                image: 'https://i.imgur.com/5qSSGHi.jpeg',
                title: 'Оркестр CAGMO | Концерт при свечах',
                place: 'Детская филармония',
                date: new Date('2025-03-12T12:00:00'),
                price: 'от 1500₽',
                tags:  ['Классическая музыка', 'Саундтрек', 'Неоклассика', 'Шоу', 'Концерт'],
                routerLink: '#',
            },
            {
                image: 'https://i.imgur.com/5qSSGHi.jpeg',
                title: 'Оркестр CAGMO | Концерт при свечах',
                place: 'Детская филармония',
                date: new Date('2025-03-12T12:00:00'),
                price: 'от 1500₽',
                tags:  ['Классическая музыка', 'Саундтрек', 'Неоклассика', 'Шоу', 'Концерт'],
                routerLink: '#',
            },
            {
                image: 'https://i.imgur.com/5qSSGHi.jpeg',
                title: 'Оркестр CAGMO | Концерт при свечах',
                place: 'Детская филармония',
                date: new Date('2025-03-12T12:00:00'),
                price: 'от 1500₽',
                tags:  ['Классическая музыка', 'Саундтрек', 'Неоклассика', 'Шоу', 'Концерт'],
                routerLink: '#',
            },
        ];
    }
}