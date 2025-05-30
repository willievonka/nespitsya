import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiIcon, TuiLink } from '@taiga-ui/core';
import { TuiChipComponent } from '../../../../../../../../../../components/tui-components/tui-chip/tui-chip.component';
import { CommonModule, DatePipe } from '@angular/common';
import { TuiAccentButtonComponent } from '../../../../../../../../../../components/tui-components/tui-accent-button/tui-accent-button.component';
import { AuthService } from '../../../../../../../../../auth.page/services/auth.service';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { TuiLike } from '@taiga-ui/kit';
import { AccountService } from '../../../../../../../../../account.page/services/account.service';
import { IUser } from '../../../../../../../../../../interfaces/user.interface';


@Component({
    selector: 'app-event-card',
    imports: [
        CommonModule,
        DatePipe,
        TuiIcon,
        TuiLike,
        TuiLink,
        TuiChipComponent,
        TuiAccentButtonComponent,
    ],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
    @Input()
    public id: number = 0;
    @Input()
    public backgroundUrl: string = '';
    @Input()
    public title: string = '';
    @Input()
    public place: string = '';
    @Input()
    public location: string = '';
    @Input()
    public dateStart: Date = new Date();
    @Input()
    public dateEnd: Date = new Date();
    @Input()
    public tags: Array<{id: number, name: string}> = [];
    @Input()
    public price: number = 0;

    public user$: Observable<IUser>;
    protected isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    protected isLiked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private _authService: AuthService, private _accountService: AccountService) {
        this.isAuthenticated$ = this._authService.isAuthenticated$;
        this.user$ = this._accountService.getUser();
        this.user$.pipe(take(1)).subscribe(user => {
            this.isLiked$.next(!!user.favorites?.includes(this.id));
        });
    }

    /**
     * Toggles the like status for the current event for the authenticated user.
     */
    public toogleLike(): void {
        this.user$.pipe(take(1)).subscribe(user => {
            if (this.isLiked$.value) {
                this._accountService.removeFromFavorites(user, this.id).pipe(take(1)).subscribe();
                this.isLiked$.next(false);
            } else {
                this._accountService.addToFavorites(user, this.id).pipe(take(1)).subscribe();
                this.isLiked$.next(true);
            }
        });
    }
}
