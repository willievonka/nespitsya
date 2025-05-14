import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import { TuiButton, TuiDropdown, TuiIcon } from '@taiga-ui/core';
import { TuiChevron } from '@taiga-ui/kit';
import { TuiFlatButtonComponent } from '../tui-flat-button/tui-flat-button.component';


@Component({
    selector: 'app-tui-dropdown',
    imports: [
        CommonModule,
        TuiActiveZone,
        TuiObscured,
        TuiButton,
        TuiChevron,
        TuiDropdown,
        TuiIcon,
        TuiFlatButtonComponent,
        RouterLink,
    ],
    templateUrl: './tui-dropdown.component.html',
    styleUrl: './tui-dropdown.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiDropdownComponent {
    @Input()
    public dropdownText: string = '';
    @Input()
    public dropdownIcon: string = '';
    @Input()
    public size: 's' | 'm' | 'l' | 'xl' | 'xs' = 's';

    public citiesButtonText: string = 'Города';
    public citiesButtonIcon: string = '@tui.map-pin';

    public artistsButtonText: string = 'Исполнители';
    public artistsButtonIcon: string = '@tui.music';

    protected open: boolean = false;
 
    /**
     * Toggles the dropdown open state.
     */
    protected onClick(): void {
        this.open = !this.open;
    }
 
    /**
     * Handles the obscured state of the dropdown.
     * @param obscured - A boolean indicating if the dropdown is obscured.
     */
    protected onObscured(obscured: boolean): void {
        if (obscured) {
            this.open = false;
        }
    }
 
    /**
     * Handles the active zone state of the dropdown.
     * @param active - A boolean indicating if the dropdown is in the active zone.
     */
    protected onActiveZone(active: boolean): void {
        this.open = active && this.open;
    }
}
