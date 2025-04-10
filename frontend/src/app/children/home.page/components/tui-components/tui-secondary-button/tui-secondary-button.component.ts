import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tui-secondary-button',
    imports: [
        CommonModule,
        TuiButton,
        TuiIcon,
    ],
    templateUrl: './tui-secondary-button.component.html',
    styleUrl: './tui-secondary-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiSecondaryButtonComponent {
    @Input()
    public buttonText: string = '';
    @Input()
    public buttonIconLeft: string = '';
    @Input()
    public buttonIconRight: string = '';
    @Input()
    public size: 's' | 'm' | 'l' | 'xl' | 'xs' = 's';
}
