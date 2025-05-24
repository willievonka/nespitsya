import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiFieldErrorPipe, TuiPassword, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { AccountService } from '../../services/account.service';
import { IUser } from '../../../../interfaces/user.interface';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { AvatarComponent } from './components/avatar/avatar.component';
import { fieldsMatchValidator } from '../../../../utils/fields-match.validator';


@Component({
    selector: 'app-profile',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TuiButton,
        TuiPassword,
        TuiTextfield,
        TuiError,
        TuiIcon,
        TuiFieldErrorPipe,
        AvatarComponent
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        tuiValidationErrorsProvider({
            required: 'Заполните поле',
            fieldsNotMatched: 'Пароли не совпадают',
        }),
    ],
})
export class ProfileComponent {
    public user$: Observable<IUser>;
    public usernameEditable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public usernameChangeError: string | null = null;
    public passwordChangeError: string | null = null;

    protected readonly usernameChangeForm: FormGroup = new FormGroup({
        username: new FormControl('', Validators.required),
    });

    protected readonly passwordChangeForm: FormGroup = new FormGroup({
        currentPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', Validators.required),
        confirmPassword: new FormControl('', Validators.compose([Validators.required, fieldsMatchValidator('newPassword')])),
    });

    constructor(private _accountService: AccountService) {
        this.user$ = this._accountService.getUser();
        this.user$.pipe(take(1)).subscribe(user => {
            this.usernameChangeForm.patchValue({ username: user.username });
        });
    }

    // [ ] TODO: Доработать логику изменения имени пользователя и пароля

    /**
     * 
     */
    public onUsernameChange(): void {
        if (this.usernameChangeForm.invalid) {
            this.usernameChangeForm.markAllAsTouched();
            
            return;
        }

        const newUsername: string = this.usernameChangeForm.get('username')?.value;
        console.log(newUsername);
        this.usernameEditable$.next(false);
    }

    /**
     *
     */
    public onPasswordChange(): void {
        if (this.passwordChangeForm.invalid) {
            this.passwordChangeForm.markAllAsTouched();
            
            return;
        }

        const currentPassword: string = this.passwordChangeForm.get('currentPassword')?.value;
        const newPassword: string = this.passwordChangeForm.get('newPassword')?.value;

        console.log(`Current Password: ${currentPassword}, New Password: ${newPassword}`);
    }
}
