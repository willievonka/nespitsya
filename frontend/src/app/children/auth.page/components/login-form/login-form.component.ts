import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef } from '@angular/core';
import { TuiAccentButtonComponent } from '../../../../components/tui-components/tui-accent-button/tui-accent-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiFieldErrorPipe, TuiPassword, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiTextfield, TuiError, TuiIcon, TuiLink } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
    selector: 'app-login-form',
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
    public loginError: string | null = null;

    protected readonly loginForm: FormGroup = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.required,  Validators.email])),
        password: new FormControl('', Validators.required)
    });

    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _destroyRef: DestroyRef,
        private _cdr: ChangeDetectorRef
    ) {}

    
    /**
     * Handles the login form submission, validates the form, and triggers the authentication process.
     */
    public onLogin(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();

            return;
        }
        this._authService.login(this.loginForm)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Login successful:', response);
                    this.loginForm.reset();
                    this._router.navigate(['home']);
                },
                error: (error) => {
                    this.loginError = error?.error?.message || 'Неизвестная ошибка входа';
                    console.error('Login failed:', error);
                    this._cdr.detectChanges();
                },
            });
    }
}
