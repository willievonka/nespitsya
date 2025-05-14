import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { TuiInputModule,TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiHint, TuiTextfield } from '@taiga-ui/core';
import { TuiValidator } from '@taiga-ui/cdk';




@Component({
    selector: 'app-tui-input-email',
    imports: [
        ReactiveFormsModule,
        TuiInputModule,
        TuiTextfield,
        TuiTextfieldControllerModule,
        TuiHint,
        TuiValidator,
    ],
    templateUrl: './tui-input-email.component.html',
    styleUrl: './tui-input-email.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiInputEmailComponent {
    public inputForm: FormGroup = new FormGroup({
        email: new FormControl('',Validators.required),
    });

    protected readonly validator: ValidatorFn =  Validators.email;
}
