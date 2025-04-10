import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiBreadcrumbsComponent } from '../../components/tui-components/tui-breadcrumbs/tui-breadcrumbs.component';
import { TuiAccentButtonComponent } from '../../../../components/tui-components/tui-accent-button/tui-accent-button.component';
import { TuiInputEmailComponent } from '../../components/tui-components/tui-input-email/tui-input-email.component';
import { TuiInputTextComponent } from '../../components/tui-components/tui-input-text/tui-input-text.component';


@Component({
    selector: 'app-feedback-page',
    imports: [
        TuiBreadcrumbsComponent,
        TuiInputEmailComponent,
        TuiInputTextComponent,
        TuiAccentButtonComponent,
    ],
    templateUrl: './feedback.page.component.html',
    styleUrl: './feedback.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackPageComponent {
    public breadcrumbsItems: Array<{ caption: string, routerLink: string }> = [
        { caption: 'Главная', routerLink: '/home' },
        { caption: 'Обратная связь', routerLink: '/home/feedback' },
    ];

    public sendButtonIcon: string = '@tui.mail';
    public sendButtonText: string = 'Отправить';
}
