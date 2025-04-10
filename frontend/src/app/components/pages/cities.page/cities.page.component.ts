import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiBreadcrumbsComponent } from '../../tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { RegionsCitiesListComponent } from '../../regions-cities-list/regions-cities-list.component';
import { IRegionsGroup } from '../../../interfaces/regions-cities-list.interface';
import { CitiesPageService } from '../../../services/cities-page.service';
import { TuiTabsComponent } from '../../tui-components/tui-tabs/tui-tabs.component';
import { ActivePanelService } from '../../../services/active-panel.service';


@Component({
    selector: 'app-cities-page',
    imports: [
        CommonModule,
        TuiBreadcrumbsComponent,
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
    public regionsTabs: string[];
    public regionsList: IRegionsGroup[];
    public breadcrumbsItems: Array<{ caption: string; routerLink: string }>;

    constructor(private readonly _citiesPageService: CitiesPageService) {
        this.regionsTabs = this._citiesPageService.getRegionsTabs();
        this.regionsList = this._citiesPageService.getRegionsList();
        this.breadcrumbsItems = this._citiesPageService.getBreadcrumbs();
    }
}
