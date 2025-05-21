import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import { TuiDropdown } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiFlatButtonComponent } from '../../../tui-components/tui-flat-button/tui-flat-button.component';
import { Observable } from 'rxjs';
import { IUser } from '../../../../interfaces/user.interface';
import { AccountService } from '../../../../children/account.page/services/account.service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-account-button',
    imports: [
        CommonModule,
        TuiFlatButtonComponent,
        TuiAvatar,
        TuiDropdown,
        TuiActiveZone,
        TuiObscured,
        RouterLink,
    ],
    templateUrl: './account-button.component.html',
    styleUrl: './account-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountButtonComponent {
    public user$: Observable<IUser> = inject(AccountService).getUser();
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
