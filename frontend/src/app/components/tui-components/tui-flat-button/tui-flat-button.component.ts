import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
    selector: 'app-tui-flat-button',
    imports: [
        CommonModule, 
        TuiButton, 
        TuiIcon,
    ],
    templateUrl: './tui-flat-button.component.html',
    styleUrl: './tui-flat-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TuiFlatButtonComponent {
    @Input() 
    public buttonIconLeft: string = '';
    @Input() 
    public buttonIconRight: string = '';
    @Input() 
    public buttonText: string = '';
    @Input() 
    public buttonSize: 's' | 'm' | 'l' | 'xl' | 'xs' = 's';
}
