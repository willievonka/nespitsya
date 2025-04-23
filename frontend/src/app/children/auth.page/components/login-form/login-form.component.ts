import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiAccentButtonComponent } from '../../../../components/tui-components/tui-accent-button/tui-accent-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiFieldErrorPipe, TuiPassword, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiTextfield, TuiError, TuiIcon } from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-login-form',
    imports: [
        TuiAccentButtonComponent,
        ReactiveFormsModule,
        TuiPassword,
        TuiTextfield,
        TuiError,
        TuiIcon,
        TuiFieldErrorPipe,
        AsyncPipe,
        RouterLink,

    ],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiValidationErrorsProvider({
            required: 'Заполните поле',
            email: 'Введите корректный адрес электронной почты',
        }),
    ],
})
export class LoginFormComponent {
    protected readonly loginForm: FormGroup = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.required,  Validators.email])),
        password: new FormControl('', Validators.required)
    });
}
