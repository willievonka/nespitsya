import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TuiAccentButtonComponent } from '../../../../components/tui-components/tui-accent-button/tui-accent-button.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TuiTextfield, TuiError, TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiPassword, TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';


@Component({
    selector: 'app-register-form',
    imports: [
        CommonModule,
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
            passwordsNotMatched: 'Пароли не совпадают',
        }),
    ],
    
})
export class RegisterFormComponent {
    @Output() 
    public switchToLogin: EventEmitter<void> = new EventEmitter<void>();

    protected readonly registerForm: FormGroup = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.required,  Validators.email])),
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        passwordRepeat: new FormControl('', Validators.compose([Validators.required, this.passwordsMatch()])),
    });

    /**
     * Emits an event to switch to the login form.
     */
    public onSwitchToLogin(): void {
        this.switchToLogin.emit();
    }

    /**
     * Custom validator to check if password and passwordRepeat fields match.
     */
    public passwordsMatch(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
                return null;
            }
            const password: AbstractControl<string> | null = control.parent.get('password')?.value;
            const passwordRepeat: AbstractControl<string> | null = control.value;

            return password === passwordRepeat ? null : { passwordsNotMatched: true };
        };
    }
}
