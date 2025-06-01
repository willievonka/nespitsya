import { Injectable } from '@angular/core';
import { TuiDay, TuiDayRange } from '@taiga-ui/cdk';
import { TEventsList } from '../types/events-list.type';
import { IEvent } from '../../../../../interfaces/event.interface';

@Injectable({ providedIn: 'root' })
export class EventsFilterService {
    /**
     * Filters the list of event groups based on the selected date range, places, and event types.
     * @param events The list of event groups to filter.
     * @param selectedDate The selected date range to filter events by.
     * @param selectedPlaces The list of selected places to filter events by.
     * @param selectedTypes The list of selected event types to filter events by.
     * @returns The filtered list of event groups.
     */
    public filterEvents(
        events: TEventsList,
        selectedDate: TuiDayRange | null,
        selectedPlaces: string[],
        selectedTypes: string[]
    ): TEventsList {
        const filteredEvents: IEvent[] = [];
        events.forEach(group => {
            group.events.forEach(event => {
                if (selectedDate) {
                    const date: Date = new Date(event.dateStart);
                    const eventDay: TuiDay = new TuiDay(date.getFullYear(), date.getMonth(), date.getDate());
                    if (!(eventDay.daySameOrAfter(selectedDate.from) && eventDay.daySameOrBefore(selectedDate.to))) {
                        return;
                    }
                }
                if (selectedPlaces.length && !selectedPlaces.includes(event.place)) {
                    return;
                }
                if (selectedTypes.length && !event.tags?.some(tag => selectedTypes.includes(tag.name))) {
                    return;
                }
                filteredEvents.push(event);
            });
        });

        const groupsMap: Map<string, IEvent[]> = new Map<string, IEvent[]>();
        filteredEvents.forEach(event => {
            const date: Date = new Date(event.dateStart);
            const key: string = date.toDateString();
            if (!groupsMap.has(key)) {
                groupsMap.set(key, []);
            }
            groupsMap.get(key)!.push(event);
        });

        return Array.from(groupsMap.entries()).map(([date, eventList]: [string, IEvent[]]) => ({
            date: new Date(date),
            events: eventList,
        }));
    }
}