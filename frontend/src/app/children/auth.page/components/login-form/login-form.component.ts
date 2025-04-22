import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiAccentButtonComponent } from '../../../../components/tui-components/tui-accent-button/tui-accent-button.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiFieldErrorPipe, TuiPassword } from '@taiga-ui/kit';
import { TuiTextfield, TuiError } from '@taiga-ui/core';
import { AsyncPipe } from '@angular/common';




@Component({
    selector: 'app-login-form',
    imports: [TuiAccentButtonComponent,
        ReactiveFormsModule,
        TuiPassword,
        TuiTextfield,
        TuiError,
        TuiFieldErrorPipe,
        AsyncPipe,],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent {
    protected readonly form: FormGroup = new FormGroup({
        email: new FormControl('',Validators.email),
        password: new FormControl('',Validators.required)
    });
}
