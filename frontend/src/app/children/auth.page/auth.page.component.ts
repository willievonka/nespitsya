import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiFlatButtonComponent } from '../../components/tui-components/tui-flat-button/tui-flat-button.component';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
    selector: 'app-auth-page',
    imports: [
        CommonModule,
        RouterModule,
        TuiFlatButtonComponent,
    ],
    templateUrl: './auth.page.component.html',
    styleUrl: './auth.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
    private _canGoBack: boolean = true;

    constructor(private _location: Location, private _router: Router) {
        this._canGoBack = !!(this._router.getCurrentNavigation()?.previousNavigation);
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

