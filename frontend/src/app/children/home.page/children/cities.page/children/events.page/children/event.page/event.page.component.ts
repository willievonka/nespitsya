import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiBreadcrumbsComponent } from '../../../../../../components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { OrganizerCardComponent } from './components/organizer-card/organizer-card.component';
import { TuiSecondaryButtonComponent } from '../../../../../../components/tui-components/tui-secondary-button/tui-secondary-button.component';
import { IEvent } from '../../../../../../interfaces/event.interface';
import { IOrganizer } from '../../../../../../interfaces/organizer.interface';
import { TuiAppearance, TuiIcon } from '@taiga-ui/core';
import { MapComponent } from './components/map/map.component';
import { EventPageService } from './services/event-page.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ICity } from '../../../../../../interfaces/city.interface';


@Component({
    selector: 'app-event-page',
    imports: [
        CommonModule,
        TuiBreadcrumbsComponent,
        EventCardComponent,
        OrganizerCardComponent,
        TuiSecondaryButtonComponent,
        TuiIcon,
        TuiAppearance,
        MapComponent,
    ],
    templateUrl: './event.page.component.html',
    styleUrl: './event.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventPageComponent {
    public event$: Observable<IEvent>;
    public city$: Observable<ICity>;
    public breadcrumbsItems$: Observable<Array<{ caption: string, routerLink: string }>>;
    public organizer: IOrganizer = {
        id: 1,
        name: 'Oleg Tinkoff',
        image: 'https://i.imgur.com/5qSSGHi.jpeg',
        role: 'organizer',
        subsCount: 9,
        eventsCount: 7
    };

    public regionCityLocation: string = 'Свердловская область, Екатеринбург, улица 8 Марта, 36';

    constructor(
        private _eventPageService: EventPageService,
        private _route: ActivatedRoute,
    ) {
        const eventId: string = this._route.snapshot.paramMap.get('event-id') || '';
        const cityId: string = this._route.snapshot.paramMap.get('city-id') || '';

        this.event$ = this._eventPageService.getEvent(eventId);
        this.city$ = this._eventPageService.getCity(cityId);
        this.breadcrumbsItems$ = this._eventPageService.getBreadcrumbs(this.city$, this.event$);
    }
}
