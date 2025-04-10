import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiBreadcrumbsComponent } from '../../tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { TuiEventCardComponent } from '../../tui-components/tui-event-card/tui-event-card.component';
import { TuiSecondaryButtonComponent } from '../../tui-components/tui-button/tui-secondary-button/tui-secondary-button.component';
import { CityDeclensionPipe } from '../../../pipes/city-declension/city-declension.pipe';
import { RouterLink } from '@angular/router';
import { ICity } from '../../../interfaces/regions-cities-list.interface';
import { IEvent } from '../../../interfaces/event.interface';
import { HomePageService } from '../../../services/home-page.service';


@Component({
    selector: 'app-home-page',
    imports: [
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
    public city!: ICity;
    public events!: IEvent[];
    public moreEventsButtonText!: string;

    constructor(private _homePageService: HomePageService) {
        this.city = this._homePageService.getCity();
        this.events = this._homePageService.getEvents();
        this.moreEventsButtonText = `Больше событий в ${this.city.name}`;
    }
}
