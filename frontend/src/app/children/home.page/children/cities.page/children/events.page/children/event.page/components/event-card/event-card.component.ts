import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiChipComponent } from '../../../../../../../../components/tui-components/tui-chip/tui-chip.component';
import { CommonModule, DatePipe } from '@angular/common';
import { TuiAccentButtonComponent } from '../../../../../../../../../../components/tui-components/tui-accent-button/tui-accent-button.component';
import { TuiSecondaryButtonComponent } from '../../../../../../../../components/tui-components/tui-secondary-button/tui-secondary-button.component';


@Component({
    selector: 'app-event-card',
    imports: [
        CommonModule,
        DatePipe,
        TuiIcon,
        TuiLink,
        TuiChipComponent,
        TuiAccentButtonComponent,
        TuiSecondaryButtonComponent,
    ],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
    @Input()
    public backgroundUrl: string = '';
    @Input()
    public title: string = '';
    @Input()
    public place: string = '';
    @Input()
    public dateStart: Date = new Date();
    @Input()
    public dateEnd: Date = new Date();
    @Input()
    public tags: Array<{id: number, name: string}> = [];
    @Input()
    public price: number = 0;
}
