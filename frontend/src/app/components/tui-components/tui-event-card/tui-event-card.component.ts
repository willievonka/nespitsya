import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TuiAppearance, TuiButton } from '@taiga-ui/core';
import { TuiChipComponent } from '../tui-chip/tui-chip.component';
import { AccountService } from '../../../children/account.page/services/account.service';
import { IUser } from '../../../interfaces/user.interface';
import { take } from 'rxjs';


@Component({
    selector: 'app-tui-event-card',
    imports: [
        CommonModule,
        DatePipe,
        RouterLink,
        TuiAppearance,
        TuiChipComponent,
        TuiButton,
    ],
    templateUrl: './tui-event-card.component.html',
    styleUrl: './tui-event-card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiEventCardComponent {
    @Input()
    public id: number = 0;
    @Input()
    public image: string = '';
    @Input()
    public title: string = '';
    @Input()
    public place: string = '';
    @Input()
    public date: Date = new Date ();
    @Input()
    public price: number = 0;
    @Input()
    public tags: Array<{id: number, name: string}> = [];
    @Input()
    public routerLink: string = '';
    @Input()
    public user: IUser = {} as IUser;

    @Output()
    public removed: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Checks if the current route is the favorites page.
     */
    protected get isFavoritesPage(): boolean {
        return this._router.url.includes('/account/favorites');
    }

    constructor(
        private _accountService: AccountService, 
        private _router: Router,
    ) {}

    /**
     * Removes the current event from the user's favorites.
     */
    public onDeleteFromFavorites(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this._accountService.removeFromFavorites(this.user, this.id)
            .pipe(take(1))
            .subscribe(() => {
                this.removed.emit(this.id);
            });
    }
}
