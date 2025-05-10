import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TuiItem } from '@taiga-ui/cdk';
import { TuiBreadcrumbs } from '@taiga-ui/kit';


@Component({
    selector: 'app-tui-breadcrumbs',
    imports: [
        TuiItem, 
        TuiBreadcrumbs, 
        CommonModule, 
        RouterLink,
    ],
    templateUrl: './tui-breadcrumbs.component.html',
    styleUrl: './tui-breadcrumbs.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TuiBreadcrumbsComponent {
    @Input()
    public items: Array<{ caption: string, routerLink: string }> = [];
}
