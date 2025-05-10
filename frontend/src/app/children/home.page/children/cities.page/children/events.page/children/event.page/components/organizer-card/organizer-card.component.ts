import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { TuiFallbackSrcPipe, TuiLink } from '@taiga-ui/core';


@Component({
    selector: 'app-organizer-card',
    imports: [
        CommonModule,
        TuiAvatar,
        TuiLink,
        TuiFallbackSrcPipe,
    ],
    templateUrl: './organizer-card.component.html',
    styleUrl: './organizer-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizerCardComponent {
    @Input()
    public image: string = '';
    @Input()
    public name: string = '';
    @Input()
    public subsCount: number = 0;
    @Input()
    public eventsCount: number = 0;
}
