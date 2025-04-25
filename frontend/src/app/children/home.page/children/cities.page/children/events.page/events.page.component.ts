import { ChangeDetectionStrategy, Component, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TuiBreadcrumbsComponent } from '../../../../components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { TuiOutlineButtonComponent } from './components/tui-components/tui-outline-button/tui-outline-button.component';
import { CityDeclensionPipe } from '../../../../pipes/city-declension/city-declension.pipe';
import { TuiFilterComponent } from './components/tui-components/tui-filter/tui-filter.component';


@Component({
    selector: 'app-events.page',
    imports: [
        CommonModule,
        TuiBreadcrumbsComponent,
        CityDeclensionPipe,
        TuiOutlineButtonComponent,
        TuiFilterComponent,
    ],
    templateUrl: './events.page.component.html',
    styleUrl: './events.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPageComponent {
    public cityName: string = '';

    public activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    public searchResultsCount: number = 0;

    public breadcrumbsItems: Array<{ caption: string, routerLink: string }> = [];

    private readonly _destroyRef: DestroyRef = inject(DestroyRef);

    constructor() {
        this.activatedRoute.queryParams
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe((queryParams: Params) => {
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
