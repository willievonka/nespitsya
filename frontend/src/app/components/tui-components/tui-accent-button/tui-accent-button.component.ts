import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tui-accent-button',
    imports: [
        CommonModule,
        TuiButton, 
        TuiIcon,
    ],
    templateUrl: './tui-accent-button.component.html',
    styleUrl: './tui-accent-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiAccentButtonComponent {
    @Input() 
    public buttonIcon: string = '';
    @Input() 
    public buttonText: string = '';
    @Input()
    public buttonSize: 's' | 'm' | 'l' | 'xl' | 'xs' = 'm';
}
