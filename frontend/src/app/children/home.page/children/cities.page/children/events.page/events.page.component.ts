import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiBreadcrumbsComponent } from '../../../../components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { TuiOutlineButtonComponent } from './components/tui-components/tui-outline-button/tui-outline-button.component';
import { CityDeclensionPipe } from '../../../../pipes/city-declension/city-declension.pipe';
import { EventsPageService } from './services/events-page.service';
import { ICity } from '../../../../interfaces/city.interface';
import { map, Observable, startWith } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EventsListComponent } from './components/events-list/events-list.component';
import { TEventsList } from './types/events-list.type';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IFilterTab } from './types/filter-tab.interface';
import { IEvent } from '../../../../interfaces/event.interface';
import { DateFilterComponent } from './components/date-filter/date-filter.component';


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

    constructor(
        private readonly _eventsPageService: EventsPageService,
        private readonly _route: ActivatedRoute,
        private readonly _destroyRef: DestroyRef
    ) {
        const cityId: string = this._route.snapshot.paramMap.get('city-id') || '';

        this.city$ = this._eventsPageService.getCity(cityId);
        this.events$ = this._eventsPageService.getEvents(cityId);
        this.eventsNumber$ = this.events$.pipe(
            map(events => events.reduce((total, group) => total + group.events.length, 0))
        );
        this.breadcrumbsItems$ = this._eventsPageService.getBreadcrumbs(this.city$);

        this.initTypeTabs();
        this.initPlaceTabs();
        this.initDateList();
    }

    /**
     * Initializes filter tabs by extracting unique values from events using the provided extractor function.
     * @param extractor Function to extract an array of string values from an event.
     * @param assign Function to assign the generated tabs array.
     */
    private initTabs(
        extractor: (event: IEvent) => string[] | undefined,
        assign: (tabs: IFilterTab[]) => void
    ): void {
        this.events$.pipe(
            startWith([]),
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
     * Initializes the typeTabs array with unique event tag names.
     */
    private initTypeTabs(): void {
        this.initTabs(
            event => event.tags?.map(tag => tag.name),
            tabs => this.typeTabs = tabs
        );
    }

    /**
     * Initializes the placeTabs array with unique event place names.
     */
    private initPlaceTabs(): void {
        this.initTabs(
            event => event.place ? [event.place] : [],
            tabs => this.placeTabs = tabs
        );
    }

    /**
     * Initializes the dateList array with unique event start dates.
     */
    private initDateList(): void {
        this.events$.pipe(
            startWith([]),
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