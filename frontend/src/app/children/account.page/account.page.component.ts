import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButton } from '@taiga-ui/core';
import { TuiTabs } from '@taiga-ui/kit';


@Component({
    selector: 'app-account-page',
    imports: [
        CommonModule,
        RouterModule,
        TuiButton,
        TuiTabs,
    ],
    templateUrl: './account.page.component.html',
    styleUrl: './account.page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountPageComponent {
    public role: 'user' | 'organizer' | 'admin';
    public roleTabs: {
        user: Array<{ path: string; label: string; icon: string }>;
        organizer: Array<{ path: string; label: string; icon: string }>;
        admin: Array<{ path: string; label: string; icon: string }>;
    };

    constructor() {
        this.role = 'organizer';

        this.roleTabs = {
            user: [
                { path: 'profile', label: 'Аккаунт', icon: 'circle-user' },
                { path: 'favorites', label: 'Избранные мероприятия', icon: 'heart' },
                { path: 'subscriptions', label: 'Подписки на организаторов', icon: 'users' },
            ],
            organizer: [
                { path: 'profile', label: 'Аккаунт', icon: 'circle-user' },
                { path: 'my-events', label: 'Мои мероприятия', icon: 'heart' },
                { path: 'create-event', label: 'Создать мероприятие', icon: 'circle-plus' },
            ],
            admin: [
                { path: 'profile', label: 'Аккаунт', icon: 'circle-user' },
            ],
        };
    }
}
