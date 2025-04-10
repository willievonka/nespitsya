import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { TuiInputModule,TuiTextareaModule } from '@taiga-ui/legacy';


@Component({
    selector: 'app-tui-input-text',
    imports: [
        ReactiveFormsModule,
        TuiInputModule,
        TuiTextareaModule

    ],
    templateUrl: './tui-input-text.component.html',
    styleUrl: './tui-input-text.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiInputTextComponent {
    public inputForm: FormGroup = new FormGroup({
        text: new FormControl('',Validators.required),
    });
}
