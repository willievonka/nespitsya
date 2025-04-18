import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IPopularCity } from '../../interfaces/popular-city.interface';
import { TuiSecondaryButtonComponent } from '../../../../components/tui-components/tui-secondary-button/tui-secondary-button.component';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-popular-cities-list',
    imports: [
        CommonModule,
        TuiSecondaryButtonComponent,
        RouterLink,
    ],
    templateUrl: './popular-cities-list.component.html',
    styleUrl: './popular-cities-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopularCitiesListComponent {
    @Input()
    public cities: IPopularCity[] = [];
}
