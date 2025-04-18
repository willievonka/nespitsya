import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiBreadcrumbsComponent } from '../../components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { PopularCitiesListComponent } from './components/popular-cities-list/popular-cities-list.component';
import { RegionsCitiesListComponent } from './components/regions-cities-list/regions-cities-list.component';
import { IRegionsGroup } from './interfaces/regions-group.interface';
import { TuiTabsComponent } from '../../components/tui-components/tui-tabs/tui-tabs.component';
import { CitiesPageService } from './services/cities-page.service';
import { ActivePanelService } from './services/active-panel.service';
import { IPopularCity } from './interfaces/popular-city.interface';


@Component({
    selector: 'app-cities-page',
    imports: [
        CommonModule,
        TuiBreadcrumbsComponent,
        PopularCitiesListComponent,
        RegionsCitiesListComponent,
        TuiTabsComponent,
    ],
    providers: [
        ActivePanelService,
    ],
    templateUrl: './cities.page.component.html',
    styleUrl: './cities.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CitiesPageComponent {
    public breadcrumbsItems: Array<{ caption: string; routerLink: string }>;
    public popularCitiesList: IPopularCity[];
    public regionsTabs: string[];
    public regionsList: IRegionsGroup[];

    constructor(private readonly _citiesPageService: CitiesPageService) {
        this.popularCitiesList = this._citiesPageService.getPopularCitiesList();
        this.regionsTabs = this._citiesPageService.getRegionsTabs();
        this.regionsList = this._citiesPageService.getRegionsList();
        this.breadcrumbsItems = this._citiesPageService.getBreadcrumbs();
    }
}
