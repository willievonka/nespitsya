import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TuiAppearance } from '@taiga-ui/core';
import { TuiCardLarge } from '@taiga-ui/layout';
import { TuiChipComponent } from '../tui-chip/tui-chip.component';
import { RouterLink } from '@angular/router';
import { IEvent } from '../../../interfaces/event.interface';


@Component({
    selector: 'app-tui-event-card',
    imports: [
        CommonModule,
        DatePipe,
        RouterLink,
        TuiCardLarge,
        TuiAppearance,
        TuiChipComponent,
    ],
    templateUrl: './tui-event-card.component.html',
    styleUrl: './tui-event-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiEventCardComponent implements IEvent {
    @Input()
    public image: string = '';
    @Input()
    public title: string = '';
    @Input()
    public place: string = '';
    @Input()
    public date: Date = new Date ();
    @Input()
    public price: string = '';
    @Input()
    public tags: string[] = [];
    @Input()
    public routerLink: string = '';
}
