import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiEventCardComponent } from '../../../../../../../../components/tui-components/tui-event-card/tui-event-card.component';
import { CommonModule } from '@angular/common';
import { TEventsList } from '../../types/events-list.type';


@Component({
    selector: 'app-events-list',
    imports: [
        CommonModule,
        TuiEventCardComponent,
    ],
    templateUrl: './events-list.component.html',
    styleUrl: './events-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListComponent {
    @Input()
    public eventsList: TEventsList = [];
}
