import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    
    constructor(
        private _eventsPageService: EventsPageService, 
        private _route: ActivatedRoute,
    ) {
        const cityId: string = this._route.snapshot.paramMap.get('city-id') || '';

        this.city$ = this._eventsPageService.getCity(cityId);
        this.events$ = this._eventsPageService.getEvents(cityId);
        this.eventsNumber$ = this.events$.pipe(
            map((events: TEventsList) => 
                events.reduce((total: number, eventGroup: { events: IEvent[] }) => 
                    total + eventGroup.events.length, 0
                )
            )
        );
        this.breadcrumbsItems$ = this._eventsPageService.getBreadcrumbs(this.city$);
    }
}
