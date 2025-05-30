import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TuiBreadcrumbsComponent } from '../../../../components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { TuiOutlineButtonComponent } from './components/tui-components/tui-outline-button/tui-outline-button.component';
import { CityDeclensionPipe } from '../../../../pipes/city-declension/city-declension.pipe';
import { EventsPageService } from './services/events-page.service';
import { ICity } from '../../../../interfaces/city.interface';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EventsListComponent } from './components/events-list/events-list.component';
import { TEventsList } from './types/events-list.type';
import { IEvent } from '../../../../interfaces/event.interface';


@Component({
    selector: 'app-events.page',
    imports: [
        CommonModule,
        FormsModule,
        EventsListComponent,
        TuiBreadcrumbsComponent,
        CityDeclensionPipe,
        TuiOutlineButtonComponent,
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
    public selectedDate?: Date;
    private _cityId: string;

    constructor(
        private _eventsPageService: EventsPageService,
        private _route: ActivatedRoute,
    ) {
        this._cityId = this._route.snapshot.paramMap.get('city-id') || '';

        this.city$ = this._eventsPageService.getCity(this._cityId);
        this.events$ = this._eventsPageService.getEvents(this._cityId);
        this.eventsNumber$ = this.events$.pipe(
            map((events: TEventsList) =>
                events.reduce((total: number, eventGroup: { events: IEvent[] }) =>
                    total + eventGroup.events.length, 0
                )
            )
        );
        this.breadcrumbsItems$ = this._eventsPageService.getBreadcrumbs(this.city$);
    }

    /**
     * Обработчик изменения фильтра по дате
     */
    public onDateFilterChange(): void {
        if (this.selectedDate) {
            this.events$ = this._eventsPageService.getEventsByDate(this._cityId, this.selectedDate.toISOString());
        } else {
            this.events$ = this._eventsPageService.getEvents(this._cityId);
        }
        this.eventsNumber$ = this.events$.pipe(
            map((events: TEventsList) =>
                events.reduce((total: number, eventGroup: { events: IEvent[] }) =>
                    total + eventGroup.events.length, 0
                )
            )
        );
    }
}
