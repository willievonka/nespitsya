import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../../../../interfaces/user.interface';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';


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

    constructor(private _accountService: AccountService) {
        this._accountService.getUser().subscribe(user => {
            this.user$.next(user);
        });
    }
}
