import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiFilter } from '@taiga-ui/kit';
import type { TuiHandler } from '@taiga-ui/cdk';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: 'app-tui-filter',
    imports: [
        TuiFilter,
        ReactiveFormsModule,
    ],
    templateUrl: './tui-filter.component.html',
    styleUrl: './tui-filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiFilterComponent {
    public items: readonly string[] = [
        'Drafts',
        'Sent',
    ];

    protected readonly form: FormGroup = new FormGroup({
        filters: new FormControl([
            {
                title: 'Drafts',
            },
        ]),
    });

    protected badgeHandler: TuiHandler<string, number> = (value => value.length);
}
