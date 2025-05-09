import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TuiInputSearchComponent } from '../tui-components/tui-input-search/tui-input-search.component';
import { TuiAccentButtonComponent } from '../tui-components/tui-accent-button/tui-accent-button.component';
import { TuiDropdownComponent } from '../tui-components/tui-dropdown/tui-dropdown.component';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
    selector: 'app-header',
    imports: [
        CommonModule,
        RouterLink,
        TuiInputSearchComponent,
        TuiAccentButtonComponent,
        TuiDropdownComponent,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
    public isAuthPage: boolean = false;

    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    constructor(private _router: Router, private _cdr: ChangeDetectorRef) {
        this._router.events.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
            this.isAuthPage = this._router.url.includes('/auth');
            this._cdr.detectChanges();
        });
    }
}
