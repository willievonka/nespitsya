import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiBreadcrumbsComponent } from '../../../../components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { TuiOutlineButtonComponent } from './components/tui-components/tui-outline-button/tui-outline-button.component';
import { CityDeclensionPipe } from '../../../../pipes/city-declension/city-declension.pipe';
import { EventsPageService } from './services/events-page.service';
import { ICity } from '../../../../interfaces/city.interface';
import { BehaviorSubject, combineLatest, map, Observable, startWith } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EventsListComponent } from './components/events-list/events-list.component';
import { TEventsList } from './types/events-list.type';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IFilterTab } from './types/filter-tab.interface';
import { IEvent } from '../../../../interfaces/event.interface';
import { DateFilterComponent } from './components/date-filter/date-filter.component';
import { TuiDayRange } from '@taiga-ui/cdk';
import { EventsFilterService } from './services/events-filter.service';


@Component({
    selector: 'app-events.page',
    imports: [
        CommonModule,
        FormsModule,
        EventsListComponent,
        TuiBreadcrumbsComponent,
        CityDeclensionPipe,
        TuiOutlineButtonComponent,
        FilterComponent,
        DateFilterComponent
    ],
    templateUrl: './events.page.component.html',
    styleUrl: './events.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent {
    public city$: Observable<ICity>;
    public events$: Observable<TEventsList>;
    public eventsNumber$: Observable<number>;
    public breadcrumbsItems$: Observable<Array<{ caption: string, routerLink: string }>>;

    protected placeTabs: IFilterTab[] = [];
    protected typeTabs: IFilterTab[] = [];
    protected dateList: Date[] = [];

    private _selectedDate$: BehaviorSubject<TuiDayRange | null> = new BehaviorSubject<TuiDayRange | null>(null);
    private _selectedPlaces$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    private _selectedTypes$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    constructor(
        private readonly _eventsPageService: EventsPageService,
        private readonly _route: ActivatedRoute,
        private readonly _destroyRef: DestroyRef,
        private readonly _filterService: EventsFilterService
    ) {
        const cityId: string = this._route.snapshot.paramMap.get('city-id') || '';

        this.city$ = this._eventsPageService.getCity(cityId);
        const allEvents$: Observable<TEventsList> = this._eventsPageService.getEvents(cityId).pipe(startWith([]));

        this.events$ = combineLatest([
            allEvents$,
            this._selectedDate$,
            this._selectedPlaces$,
            this._selectedTypes$
        ]).pipe(
            map(([events, date, places, types]: [TEventsList, TuiDayRange | null, string[], string[]]) =>
                this._filterService.filterEvents(events, date, places, types)
            )
        );

        this.eventsNumber$ = this.events$.pipe(
            map(events => events.reduce((total, group) => total + group.events.length, 0))
        );
        this.breadcrumbsItems$ = this._eventsPageService.getBreadcrumbs(this.city$);

        this.initTypeTabs(allEvents$);
        this.initPlaceTabs(allEvents$);
        this.initDateList(allEvents$);
    }

    /**
     * Handles the change of the selected date range.
     * @param range The new selected date range or null.
     */
    public onDateChange(range: TuiDayRange | null): void {
        this._selectedDate$.next(range);
    }
    /**
     * Handles the change of the selected places.
     * @param selected The array of selected place names.
     */
    public onPlaceChange(selected: string[]): void {
        this._selectedPlaces$.next(selected);
    }
    /**
     * Handles the change of the selected event types.
     * @param selected The array of selected type names.
     */
    public onTypeChange(selected: string[]): void {
        this._selectedTypes$.next(selected);
    }

    /**
     * Initializes filter tabs by extracting unique values from events using the provided extractor and assigns them using the assign callback.
     * @param allEvents$ Observable emitting the list of event groups.
     * @param extractor Function to extract an array of string values from an event.
     * @param assign Callback to assign the generated tabs array.
     */
    private initTabs(
        allEvents$: Observable<TEventsList>,
        extractor: (event: IEvent) => string[] | undefined,
        assign: (tabs: IFilterTab[]) => void
    ): void {
        allEvents$.pipe(
            map(events => {
                const values: Set<string> = new Set<string>();
                events.forEach(group => {
                    group.events.forEach(event => {
                        extractor(event)?.forEach(val => values.add(val));
                    });
                });
                
                return Array.from(values);
            }),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe(uniqueValues => {
            assign(uniqueValues.map(val => ({ name: val, checked: false })));
        });
    }

    /**
     * Initializes the typeTabs array with unique event type names.
     * @param allEvents$ Observable emitting the list of event groups.
     */
    private initTypeTabs(allEvents$: Observable<TEventsList>): void {
        this.initTabs(
            allEvents$,
            event => event.tags?.map(tag => tag.name),
            tabs => this.typeTabs = tabs
        );
    }

    /**
     * Initializes the placeTabs array with unique event place names.
     * @param allEvents$ Observable emitting the list of event groups.
     */
    private initPlaceTabs(allEvents$: Observable<TEventsList>): void {
        this.initTabs(
            allEvents$,
            event => event.place ? [event.place] : [],
            tabs => this.placeTabs = tabs
        );
    }

    /**
     * Initializes the dateList array with unique event start dates.
     * @param allEvents$ Observable emitting the list of event groups.
     */
    private initDateList(allEvents$: Observable<TEventsList>): void {
        allEvents$.pipe(
            map(events => {
                const dates: Set<Date> = new Set<Date>();
                events.forEach(group => {
                    group.events.forEach(event => {
                        if (event.dateStart) {
                            dates.add(new Date(event.dateStart));
                        }
                    });
                });
                
                return Array.from(dates).sort();
            }),
            takeUntilDestroyed(this._destroyRef)
        ).subscribe(dateList => {
            this.dateList = dateList;
        });
    }
}