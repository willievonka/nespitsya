import { TuiRoot } from '@taiga-ui/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';


@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        TuiRoot,
        HeaderComponent,
        FooterComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    public title: string = 'nespitsya';
}
