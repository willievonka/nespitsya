import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
    selector: 'app-tui-outline-button',
    imports: [
        CommonModule,
        TuiButton,
        TuiIcon,
    ],
    templateUrl: './tui-outline-button.component.html',
    styleUrl: './tui-outline-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiOutlineButtonComponent {
    @Input()
    public buttonIconLeft: string = '';
    @Input()
    public buttonIconRight: string = '';
    @Input()
    public buttonText: string = '';
    @Input()
    public buttonSize: 's' | 'm' | 'l' | 'xl' | 'xs' = 's';
}
