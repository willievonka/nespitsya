import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TuiAppearance } from '@taiga-ui/core';
import { TuiChipComponent } from '../tui-chip/tui-chip.component';


@Component({
    selector: 'app-tui-event-card',
    imports: [
        CommonModule,
        DatePipe,
        RouterLink,
        TuiAppearance,
        TuiChipComponent,
    ],
    templateUrl: './tui-event-card.component.html',
    styleUrl: './tui-event-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiEventCardComponent {
    @Input()
    public image: string = '';
    @Input()
    public title: string = '';
    @Input()
    public place: string = '';
    @Input()
    public date: Date = new Date ();
    @Input()
    public price: number = 0;
    @Input()
    public tags: Array<{id: number, name: string}> = [];
    @Input()
    public routerLink: string = '';
}
