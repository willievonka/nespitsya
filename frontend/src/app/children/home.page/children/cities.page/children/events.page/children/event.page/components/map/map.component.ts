import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { YMapComponent, YMapDefaultFeaturesLayerDirective, YMapDefaultMarkerDirective, YMapDefaultSchemeLayerDirective } from 'angular-yandex-maps-v3';


@Component({
    selector: 'app-map',
    imports: [
        YMapComponent,
        YMapDefaultSchemeLayerDirective,
        YMapDefaultFeaturesLayerDirective,
        YMapDefaultMarkerDirective,
    ],
    templateUrl: './map.component.html',
    styleUrl: './map.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent {
    @Input()
    public title: string = '';
    @Input()
    public place: string = '';
    @Input()
    public coordinates: [number, number] = [0, 0];
}
