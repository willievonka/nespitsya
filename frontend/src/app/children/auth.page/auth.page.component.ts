import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { TuiFlatButtonComponent } from '../../components/tui-components/tui-flat-button/tui-flat-button.component';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterFormComponent } from './components/register-form/register-form.component';


@Component({
    selector: 'app-auth.page',
    imports: [
        CommonModule,
        LoginFormComponent,
        TuiFlatButtonComponent,
        RegisterFormComponent
    ],
    templateUrl: './auth.page.component.html',
    styleUrl: './auth.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
    protected hasAccount: boolean = true;

    private _canGoBack: boolean = true;

    constructor(private _location: Location, private _router: Router) {
        this._canGoBack = !!(this._router.getCurrentNavigation()?.previousNavigation);
    }

    /**
     * Toggles the form between login and register states.
     */
    public toggleForm(): void {
        this.hasAccount = !this.hasAccount;
    }

    /**
     * Navigates back to the previous page if possible, otherwise redirects to the home page.
     */
    public goBack(): void {
        if (this._canGoBack) {
            this._location.back();
        }
        else {
            this._router.navigate(['/']);
        }
    }
}

