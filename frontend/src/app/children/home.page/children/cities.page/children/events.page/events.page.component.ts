import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiBreadcrumbsComponent } from '../../../../components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { TuiOutlineButtonComponent } from './components/tui-components/tui-outline-button/tui-outline-button.component';
import { CityDeclensionPipe } from '../../../../pipes/city-declension/city-declension.pipe';
import { TuiFilterComponent } from './components/tui-components/tui-filter/tui-filter.component';
import { EventsPageService } from './services/events-page.service';
import { ICity } from '../../../../interfaces/city.interface';
import { Observable } from 'rxjs';
import { IEvent } from '../../../../interfaces/event.interface';
import { ActivatedRoute } from '@angular/router';
import { TuiEventCardComponent } from '../../../../components/tui-components/tui-event-card/tui-event-card.component';


@Component({
    selector: 'app-events.page',
    imports: [
        CommonModule,
        TuiBreadcrumbsComponent,
        CityDeclensionPipe,
        TuiOutlineButtonComponent,
        TuiFilterComponent,
        TuiEventCardComponent,
    ],
    templateUrl: './events.page.component.html',
    styleUrl: './events.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent {
    public city$: Observable<ICity>;
    public events$: Observable<IEvent[]>;
    public breadcrumbsItems$: Observable<Array<{ caption: string, routerLink: string }>>;
    
    constructor(
        private _eventsPageService: EventsPageService, 
        private _route: ActivatedRoute,
    ) {
        const cityId: string = this._route.snapshot.paramMap.get('city-id') || '';

        this.city$ = this._eventsPageService.getCity(cityId);
        this.events$ = this._eventsPageService.getEvents(cityId);
        this.breadcrumbsItems$ = this._eventsPageService.getBreadcrumbs(this.city$);
    }
}
