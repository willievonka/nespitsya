import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { TuiFlatButtonComponent } from '../../components/tui-components/tui-flat-button/tui-flat-button.component';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-auth.page',
    imports: [
        LoginFormComponent,
        TuiFlatButtonComponent,
        RouterLink,
    ],
    templateUrl: './auth.page.component.html',
    styleUrl: './auth.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {

}

