import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TuiAccentButtonComponent } from '../../../../components/tui-components/tui-accent-button/tui-accent-button.component';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiTextfield, TuiError, TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiPassword, TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';


@Component({
    selector: 'app-register-form',
    imports: [
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
    templateUrl: './register-form.component.html',
    styleUrl: './register-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiValidationErrorsProvider({
            required: 'Заполните поле',
            email: 'Введите корректный адрес электронной почты',
        }),
    ],
    
})
export class RegisterFormComponent {
    @Output() 
    public switchToLogin: EventEmitter<void> = new EventEmitter<void>();

    protected readonly registerForm: FormGroup = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.required,  Validators.email])),
        password: new FormControl('', Validators.required)
    });

    /**
     * Emits an event to switch to the login form.
     */
    public onSwitchToLogin(): void {
        this.switchToLogin.emit();
    }
}
