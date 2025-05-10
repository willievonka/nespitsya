import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiBreadcrumbsComponent } from './components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { TuiSecondaryButtonComponent } from './components/tui-components/tui-secondary-button/tui-secondary-button.component';
import { CityDeclensionPipe } from './pipes/city-declension/city-declension.pipe';
import { ICity } from './interfaces/city.interface';
import { IEvent } from './interfaces/event.interface';
import { HomePageService } from './services/home-page.service';
import { map, Observable, switchMap } from 'rxjs';
import { TuiLink } from '@taiga-ui/core';
import { TuiEventCardComponent } from '../../components/tui-components/tui-event-card/tui-event-card.component';
import { TuiCarouselComponent } from './components/tui-components/tui-carousel/tui-carousel.component';


@Component({
    selector: 'app-home-page',
    imports: [
        CommonModule,
        TuiLink,
        TuiBreadcrumbsComponent,
        TuiSecondaryButtonComponent,
        TuiCarouselComponent,
        TuiEventCardComponent,
        CityDeclensionPipe,
        RouterLink,
    ],
    templateUrl: './home.page.component.html',
    styleUrl: './home.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
    public city$: Observable<ICity>;
    public events$: Observable<IEvent[]>;

    constructor(private _homePageService: HomePageService) {
        this.city$ = this._homePageService.getCity();
        this.events$ = this.city$.pipe(
            map(city => city.id),
            switchMap(cityId => this._homePageService.getEvents(cityId))
        );
    }
}
