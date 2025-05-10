import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiChip } from '@taiga-ui/kit';


@Component({
    selector: 'app-tui-chip',
    imports: [TuiChip],
    templateUrl: './tui-chip.component.html',
    styleUrl: './tui-chip.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiChipComponent {
    @Input()
    public value: string = '';
}
