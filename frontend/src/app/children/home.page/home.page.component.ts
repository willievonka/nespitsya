import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiBreadcrumbsComponent } from './components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { TuiEventCardComponent } from './components/tui-components/tui-event-card/tui-event-card.component';
import { TuiSecondaryButtonComponent } from './components/tui-components/tui-secondary-button/tui-secondary-button.component';
import { CityDeclensionPipe } from './pipes/city-declension/city-declension.pipe';
import { ICity } from './interfaces/city.interface';
import { IEvent } from './interfaces/event.interface';
import { HomePageService } from './services/home-page.service';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-home-page',
    imports: [
        AsyncPipe,
        CommonModule,
        TuiBreadcrumbsComponent,
        TuiEventCardComponent,
        TuiSecondaryButtonComponent,
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
        this.city$ = this._homePageService.city$;
        this.events$ = this._homePageService.events$;
    }
}
