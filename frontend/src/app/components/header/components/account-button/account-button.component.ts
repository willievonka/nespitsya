import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import { TuiButton, TuiDropdown } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { map, Observable } from 'rxjs';
import { IUser } from '../../../../interfaces/user.interface';
import { AccountService } from '../../../../children/account.page/services/account.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../children/auth.page/services/auth.service';


@Component({
    selector: 'app-account-button',
    imports: [
        CommonModule,
        TuiAvatar,
        TuiButton,
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
    public user$: Observable<IUser>;
    public tabs$: Observable<Array<{ name: string; icon: string; route: string }>>;
    protected open: boolean = false;

    constructor(
        private _accountService: AccountService, 
        private _authService: AuthService,
    ) {
        this.user$ = this._accountService.getUser();
        this.tabs$ = this.user$.pipe(
            map(user => this._accountService.getTabs(user))
        );
    }

    /**
     * Logs the user out by calling the logout method of the AuthService.
     */
    public onLogout(): void {
        this._authService.logout();
    }

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
