import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { IUser } from '../../../../interfaces/user.interface';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { IEvent } from '../../../home.page/interfaces/event.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
    selector: 'app-favorites',
    imports: [
        CommonModule,
    ],
    templateUrl: './favorites.component.html',
    styleUrl: './favorites.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
    public user$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
    public events$: BehaviorSubject<IEvent[]> = new BehaviorSubject<IEvent[]>([]);

    constructor(private _accountService: AccountService, private _destroyRef: DestroyRef) {
        this._accountService.getUser().pipe(take(1)).subscribe(user => {
            this.user$.next(user);
            if (user.favorites && user.favorites.length > 0) {
                this._accountService.getEventsByIds(user.favorites)
                    .pipe(takeUntilDestroyed(this._destroyRef))
                    .subscribe(events => {
                        this.events$.next(events);
                    });
            } else {
                this.events$.next([]);
            }
        });
    }
}
