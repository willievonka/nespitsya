import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IPopularCity } from '../../interfaces/popular-city.interface';
import { PopularCityButtonComponent } from '../popular-city-button/popular-city-button.component';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-popular-cities-list',
    imports: [
        CommonModule,
        PopularCityButtonComponent,
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
