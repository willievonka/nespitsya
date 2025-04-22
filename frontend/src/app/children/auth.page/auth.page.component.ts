import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { TuiFlatButtonComponent } from '../../components/tui-components/tui-flat-button/tui-flat-button.component';
import { Location } from '@angular/common';


@Component({
    selector: 'app-auth.page',
    imports: [
        LoginFormComponent,
        TuiFlatButtonComponent,
    ],
    templateUrl: './auth.page.component.html',
    styleUrl: './auth.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
    constructor(private _location: Location) {}

    /**
     * Navigates the user to the previous location in the browser's history.
     */
    public goBack(): void {
        this._location.back();
    }
}

