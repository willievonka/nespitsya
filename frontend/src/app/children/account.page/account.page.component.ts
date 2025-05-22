import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';
import { AccountService } from './services/account.service';
import { map, Observable } from 'rxjs';
import { IUser } from '../../interfaces/user.interface';
import { AuthService } from '../auth.page/services/auth.service';


@Component({
    selector: 'app-account-page',
    imports: [
        CommonModule,
        RouterModule,
        TuiButton,
        TuiTabs,
    ],
    templateUrl: './account.page.component.html',
    styleUrl: './account.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {
    public user$: Observable<IUser>;
    public tabs$: Observable<Array<{ name: string; icon: string; route: string }>>;

    constructor(
        private _accountService: AccountService, 
        private _authService: AuthService
    ) {
        this.user$ = this._accountService.getUser();
        this.tabs$ = this.user$.pipe(
            map(user => this._accountService.getTabs(user))
        );
    }

    /**
     * Logs the user out by calling the AuthService logout method.
     */
    public onLogout(): void {
        this._authService.logout();
        console.log('Logout');
    }
}
