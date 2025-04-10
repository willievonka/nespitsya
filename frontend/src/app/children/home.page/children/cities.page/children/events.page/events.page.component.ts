import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { TuiBreadcrumbsComponent } from '../../../../../../components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { TuiOutlineButtonComponent } from '../../../../../../components/tui-components/tui-button/tui-outline-button/tui-outline-button.component';
import { CityDeclensionPipe } from '../../../../pipes/city-declension/city-declension.pipe';


@Component({
    selector: 'app-events.page',
    imports: [
        CommonModule,
        TuiBreadcrumbsComponent,
        CityDeclensionPipe,
        TuiOutlineButtonComponent
    ],
    templateUrl: './events.page.component.html',
    styleUrl: './events.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent {
    public cityName: string = '';
    public cityId: string = '';

    public activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    public searchResultsCount: number = 0;

    public breadcrumbsItems: Array<{ caption: string, routerLink: string }> = [];

    constructor() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.cityId = params['id'] as string;
        });

        this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
            this.cityName = queryParams['name'] || 'Неизвестный город';
            this.updateBreadcrumbs();
        });
    }

    /**
     * Updates the breadcrumbsItems array with the current city name and ID.
     */
    private updateBreadcrumbs(): void {
        this.breadcrumbsItems = [
            { caption: 'Главная', routerLink: '/home' },
            { caption: 'Города', routerLink: '/home/cities' },
            { caption: this.cityName, routerLink: this.activatedRoute.snapshot.url.join('/') },
        ];
    }
}
