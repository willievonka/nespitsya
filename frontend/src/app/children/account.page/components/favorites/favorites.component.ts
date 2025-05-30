import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { IUser } from '../../../../interfaces/user.interface';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { IEvent } from '../../../home.page/interfaces/event.interface';
import { TuiEventCardComponent } from '../../../../components/tui-components/tui-event-card/tui-event-card.component';
import { TuiButton } from '@taiga-ui/core';


@Component({
    selector: 'app-favorites',
    imports: [
        CommonModule,
        TuiEventCardComponent,
        TuiButton,
    ],
    templateUrl: './favorites.component.html',
    styleUrl: './favorites.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
    protected user$: Observable<IUser>;
    protected events$: Observable<IEvent[]>;

    constructor(private _accountService: AccountService) {
        this.user$ = this._accountService.getUser();
        this.events$ = this.user$.pipe(
            switchMap(user => this._accountService.getEventsByIds(user.favorites || []))
        );
    }
}
