import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrganizerCardComponent } from '../../../../components/organizer-card/organizer-card.component';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, of, switchMap, take } from 'rxjs';
import { IUser } from '../../../../interfaces/user.interface';
import { AccountService } from '../../services/account.service';
import { IOrganizer } from '../../../../interfaces/organizer.interface';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-subscriptions',
    imports: [
        CommonModule,
        OrganizerCardComponent,
        RouterLink,
    ],
    templateUrl: './subscriptions.component.html',
    styleUrl: './subscriptions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionsComponent {
    public user$: Observable<IUser>;
    protected organizers$: Observable<IOrganizer[]>;
    private _subscriptionsIds$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

    constructor(private _accountService: AccountService) {
        this.user$ = this._accountService.getUser();

        this.user$.pipe(take(1)).subscribe(user => {
            this._subscriptionsIds$.next(user.subscribes || []);
        });
        
        this.organizers$ = this._subscriptionsIds$.pipe(
            switchMap(ids => ids.length
                ? this._accountService.getOrgsByIds(ids)
                : of([] as IOrganizer[])
            )
        );
    }
}
