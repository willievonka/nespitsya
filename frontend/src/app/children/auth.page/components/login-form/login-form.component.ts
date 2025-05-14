import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TuiAccentButtonComponent } from '../../../../components/tui-components/tui-accent-button/tui-accent-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiFieldErrorPipe, TuiPassword, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiTextfield, TuiError, TuiIcon, TuiLink } from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-login-form',
    imports: [
        RouterModule,
        TuiAccentButtonComponent,
        ReactiveFormsModule,
        TuiPassword,
        TuiTextfield,
        TuiError,
        TuiIcon,
        TuiLink,
        TuiFieldErrorPipe,
        AsyncPipe,
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
    @Output() 
    public switchToRegister: EventEmitter<void> = new EventEmitter<void>();

    protected readonly loginForm: FormGroup = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.required,  Validators.email])),
        password: new FormControl('', Validators.required)
    });

    /**
     * Emits an event to switch the view to the registration form.
     */
    public onSwitchToRegister(): void {
        this.switchToRegister.emit();
    }
}
