import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiInputSearch } from '@taiga-ui/layout';
import { TuiTextfield } from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//[ ] TODO: Реализовать поиск по приложению
@Component({
    selector: 'app-tui-input-search',
    imports: [
        TuiTextfield, 
        TuiInputSearch, 
        FormsModule, 
        ReactiveFormsModule,
    ],
    templateUrl: './tui-input-search.component.html',
    styleUrl: './tui-input-search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiInputSearchComponent {
    public value: string = '';
}
