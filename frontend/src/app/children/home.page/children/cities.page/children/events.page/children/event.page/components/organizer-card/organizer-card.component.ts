import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { TuiAppearance, TuiButton, TuiFallbackSrcPipe } from '@taiga-ui/core';
import { AccountService } from '../../../../../../../../../account.page/services/account.service';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { IUser } from '../../../../../../../../../../interfaces/user.interface';
import { AuthService } from '../../../../../../../../../auth.page/services/auth.service';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-organizer-card',
    imports: [
        CommonModule,
        TuiAvatar,
        TuiButton,
        TuiAppearance,
        TuiFallbackSrcPipe,
        RouterLink,
    ],
    templateUrl: './organizer-card.component.html',
    styleUrl: './organizer-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizerCardComponent {
    @Input()
    public id: number = 0;
    @Input()
    public image: string = '';
    @Input()
    public name: string = '';
    @Input()
    public subsCount: number = 0;
    @Input()
    public eventsCount: number = 0;

    public user$: Observable<IUser>;
    protected isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    protected isSubscribed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    constructor(private _authService: AuthService, private _accountService: AccountService) {
        this.user$ = this._accountService.getUser();
        this.isAuthenticated$ = this._authService.isAuthenticated$;
        this.user$.pipe(take(1)).subscribe(user => {
            this.isSubscribed$.next(!!user.subscribes?.includes(this.id));
        });
    }

    /**
     * Toggles the subscription status for the current user to the organizer.
     */
    public toogleSubscribe(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this.user$.pipe(take(1)).subscribe(user => {
            if (this.isSubscribed$.value) {
                this._accountService.unsubscribeFromOrganizer(user, this.id)
                    .pipe(take(1))
                    .subscribe(() => this.isSubscribed$.next(false));
            } else {
                this._accountService.subscribeToOrganizer(user, this.id)
                    .pipe(take(1))
                    .subscribe(() => this.isSubscribed$.next(true));
            }
        });
    }
}
