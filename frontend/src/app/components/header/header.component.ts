import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiInputSearchComponent } from '../tui-components/tui-input-search/tui-input-search.component';
import { TuiAccentButtonComponent } from '../tui-components/tui-accent-button/tui-accent-button.component';
import { TuiDropdownComponent } from '../tui-components/tui-dropdown/tui-dropdown.component';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-header',
    imports: [
        CommonModule,
        RouterLink,
        TuiInputSearchComponent,
        TuiAccentButtonComponent,
        TuiDropdownComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    public loginButtonIcon: string = '@tui.user';
    public loginButtonText: string = 'ВОЙТИ';

    public dropdownIcon: string = '@tui.text';
}
