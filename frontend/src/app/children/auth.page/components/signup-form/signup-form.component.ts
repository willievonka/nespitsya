import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef } from '@angular/core';
import { TuiAccentButtonComponent } from '../../../../components/tui-components/tui-accent-button/tui-accent-button.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiTextfield, TuiError, TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiPassword, TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fieldsMatchValidator } from '../../../../utils/fields-match.validator';


@Component({
    selector: 'app-signup-form',
    imports: [
        CommonModule,
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
    templateUrl: './signup-form.component.html',
    styleUrl: './signup-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiValidationErrorsProvider({
            required: 'Заполните поле',
            email: 'Введите корректный адрес электронной почты',
            fieldsNotMatched: 'Пароли не совпадают',
        }),
    ],
    
})
export class SignupFormComponent {
    public signupError: string | null = null;

    protected readonly signupForm: FormGroup = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.required,  Validators.email])),
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        passwordRepeat: new FormControl('', Validators.compose([Validators.required, fieldsMatchValidator('password')])),
    });

    constructor(
        private _authService: AuthService, 
        private _router: Router, 
        private _destroyRef: DestroyRef,
        private _cdr: ChangeDetectorRef,
    ) {}

    /**
     * Handles the signup form submission, performs validation and calls the AuthService to register the user.
     */
    public onSignup(): void {
        if (this.signupForm.invalid) {
            this.signupForm.markAllAsTouched();

            return;
        }
        this._authService.signup(this.signupForm, 'user')
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Signup successful:', response);
                    this.signupForm.reset();
                    this._router.navigate(['auth', 'login']);
                },
                error: (error) => {
                    this.signupError = error?.error?.message || 'Неизвестная ошибка регистрации';
                    console.error('Signup failed:', error);
                    this._cdr.detectChanges();
                },
            });
    }
}
