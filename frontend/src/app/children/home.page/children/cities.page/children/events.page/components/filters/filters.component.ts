import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiDropdown } from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper } from '@taiga-ui/kit';
import { TuiMultiSelectModule } from '@taiga-ui/legacy';


@Component({
    selector: 'app-filters',
    imports: [
        ReactiveFormsModule,
        TuiButton,
        TuiChevron,
        TuiDataListWrapper,
        TuiDropdown,
        TuiMultiSelectModule,
    ],
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent {
    /**
     *
     */
    protected get length(): number {
        return this.value.length || 0;
    }
 
    /**
     *
     */
    protected get text(): string {
        switch (this.length) {
            case 0:
                return 'Select';
            case 1:
                return this.value[0] ?? '';
            default:
                return `${this.length} selected`;
        }
    }
 
    /**
     *
     */
    private get value(): readonly string[] {
        return this.filters.get('control')?.value || [];
    }

    protected readonly filters: FormGroup = new FormGroup({
        placeFilter: new FormControl<string[]>([]),
        typeFilter: new FormControl<string[]>([]),
        dateFilter: new FormControl([
            {
                title: 'Дата',
            },
        ])
    });

    protected open: boolean = false;
 
    protected readonly items: string[] = ['Drafts', 'In Progress', 'Completed'];

    protected badgeHandler: TuiHandler<string, number> = (value => value.length);
}
