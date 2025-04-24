import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-popular-city-button',
    imports: [],
    templateUrl: './popular-city-button.component.html',
    styleUrl: './popular-city-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopularCityButtonComponent {
    @Input()
    public text: string = '';
    @Input()
    public backgroundUrl: string = '';
}
