import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, take } from 'rxjs';
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
    private _favoritesIds$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

    constructor(private _accountService: AccountService) {
        this.user$ = this._accountService.getUser();

        this.user$.pipe(take(1)).subscribe(user => {
            this._favoritesIds$.next(user.favorites || []);
        });
        
        this.events$ = this._favoritesIds$.pipe(
            switchMap(ids => ids.length
                ? this._accountService.getEventsByIds(ids)
                : of([] as IEvent[])
            )
        );
    }

    /**
     * Removes an event from the favorites list by its ID.
     * @param eventId The ID of the event to remove.
     */
    public onEventRemoved(eventId: number): void {
        this._favoritesIds$.next(
            this._favoritesIds$.value.filter(id => id !== eventId)
        );
    }

    
    /**
     * Removes all events from the user's favorites list.
     * @param user The user whose favorites will be cleared.
     */
    public onAllEventsRemoved(user: IUser): void {
        this._accountService.removeAllFromFavorites(user)
            .pipe(take(1))
            .subscribe(() => {
                this._favoritesIds$.next([]);
            });
    }
}
