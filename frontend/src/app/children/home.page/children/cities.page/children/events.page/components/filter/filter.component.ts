import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import { TuiButton, TuiDropdown, TuiScrollbar, tuiScrollbarOptionsProvider } from '@taiga-ui/core';
import { TuiCheckbox, TuiChevron } from '@taiga-ui/kit';
import { IFilterTab } from '../../types/filter-tab.interface';


@Component({
    selector: 'app-filter',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TuiButton,
        TuiCheckbox,
        TuiChevron,
        TuiDropdown,
        TuiScrollbar,
        TuiActiveZone,
        TuiObscured,
    ],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiScrollbarOptionsProvider({
            mode: 'hover',
        }),
    ]
})
export class FilterComponent {
    @Input()
    public label: string = 'Фильтр';
    
    /**
     * Sets the filter tabs and updates the form controls accordingly.
     * @param tabs - Array of filter tab objects.
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @Input()
    public set tabs(tabs: IFilterTab[]) {
        const selectAll: IFilterTab = { name: 'Выбрать все', checked: false };
        this._tabs = [selectAll, ...(tabs ?? [])];
        this.rebuildForm();
        this.initSubscriptions();
    }
    /**
     * Gets the current filter tabs.
     */
    public get tabs(): IFilterTab[] {
        return this._tabs;
    }
    
    /**
     * Returns true if any filter tab is checked.
     */
    protected get isAnyChecked(): boolean {
        return Object.values(this.form.value).some(Boolean);
    };

    /**
     * Gets the FormControl for the "Выбрать все" (Select All) checkbox.
     */
    private get selectAllControl(): FormControl {
        return this.form.get('Выбрать все') as FormControl;
    }

    protected form: FormGroup = new FormGroup({});
    protected open: boolean = false;
    private _tabs: IFilterTab[] = [];
    
    /**
     * Toggles the dropdown open state.
     */
    protected toogleDropdown(): void {
        this.open = !this.open;
    }
 
    /**
     * Handles the obscured state of the dropdown.
     * @param obscured - A boolean indicating if the dropdown is obscured.
     */
    protected handleObscured(obscured: boolean): void {
        if (obscured) {
            this.open = false;
        }
    }
 
    /**
     * Handles the active zone state of the dropdown.
     * @param active - A boolean indicating if the dropdown is in the active zone.
     */
    protected handleActiveZone(active: boolean): void {
        this.open = active && this.open;
    }

    /**
     * Rebuilds the form controls based on the current filter tabs.
     */
    private rebuildForm(): void {
        Object.keys(this.form.controls).forEach(key => this.form.removeControl(key));
        this._tabs.forEach(tab => {
            this.form.addControl(tab.name, new FormControl(tab.checked));
        });
    }

    /**
     * Initializes subscriptions for the select all and individual tab checkboxes.
     */
    private initSubscriptions(): void {
        this.selectAllControl?.valueChanges.subscribe(checked => this.setAllChecked(checked));
        this._tabs
            .filter(tab => tab.name !== 'Выбрать все')
            .forEach(tab => {
                this.form.get(tab.name)?.valueChanges.subscribe(() => this.syncSelectAll());
            });
    }

    /**
     * Handles the "Select All" checkbox change event.
     * Sets all filter tabs (except "Выбрать все") to the checked state.
     * @param checked - The new checked state of the "Select All" checkbox.
     */
    private setAllChecked(checked: boolean): void {
        this._tabs.forEach(tab => {
            if (tab.name !== 'Выбрать все') {
                this.form.get(tab.name)?.setValue(checked, { emitEvent: false });
            }
        });
    }

    /**
     * Synchronizes the "Select All" checkbox state based on the state of other checkboxes.
     */
    private syncSelectAll(): void {
        const allChecked: boolean = this._tabs
            .filter(tab => tab.name !== 'Выбрать все')
            .every(tab => this.form.get(tab.name)?.value === true);
        this.form.get('Выбрать все')?.setValue(allChecked, { emitEvent: false });
    }
}
