import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiAvatar, TuiFieldErrorPipe, TuiPassword, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { AccountService } from '../../services/account.service';
import { IUser } from '../../../../interfaces/user.interface';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiIcon, TuiTextfield } from '@taiga-ui/core';


@Component({
    selector: 'app-profile',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TuiAvatar,
        TuiButton,
        TuiPassword,
        TuiTextfield,
        TuiError,
        TuiIcon,
        TuiFieldErrorPipe,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiValidationErrorsProvider({
            required: 'Заполните поле',
            passwordsNotMatched: 'Пароли не совпадают',
        }),
    ],
})
export class ProfileComponent {
    public user$: Observable<IUser>;
    public passwordChangeError: string | null = null;

    protected readonly passwordChangeForm: FormGroup = new FormGroup({
        currentPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.compose([Validators.required, this.passwordsMatch()])),
    });

    constructor(private _accountService: AccountService) {
        this.user$ = this._accountService.getUser();
    }

    /**
     *
     */
    public onChangePassword(): void {
        console.log('Change password');
    }

    /**
     * Custom validator to check if password and passwordRepeat fields match.
     */
    public passwordsMatch(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
                return null;
            }
            const password: AbstractControl<string> | null = control.parent.get('newPassword')?.value;
            const passwordRepeat: AbstractControl<string> | null = control.value;

            return password === passwordRepeat ? null : { passwordsNotMatched: true };
        };
    }
}
