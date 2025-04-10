import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { TuiSecondaryButtonComponent } from '../tui-components/tui-button/tui-secondary-button/tui-secondary-button.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as regionsCitiesListInterface from '../../interfaces/regions-cities-list.interface';
import { ActivePanelService } from '../../services/active-panel.service';

@Component({
    selector: 'app-regions-cities-list',
    imports: [
        CommonModule,
        TuiSecondaryButtonComponent,
        RouterLink,
    ],
    templateUrl: './regions-cities-list.component.html',
    styleUrl: './regions-cities-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionsCitiesListComponent implements regionsCitiesListInterface.IRegionsCitiesList, AfterViewInit {
    @ViewChildren('name')
    public name?: QueryList<ElementRef>;

    @Input()
    public groups: regionsCitiesListInterface.IRegionsGroup[] = [];

    protected activeService: ActivePanelService = inject(ActivePanelService);

    private _index: number = 0;

    public ngAfterViewInit(): void {
        // Подписка на изменение активного индекса
        this.activeService.subscribe((index: number) => {
            if (this.name && this._index !== index) {
                const targetElement: HTMLElement = this.name.toArray()[index].nativeElement;
                const offset: number = targetElement.offsetTop - 97; // Смещение на 97px сверху
                window.scrollTo({ top: offset, behavior: 'smooth' });
                this._index = index;
            }
        });

        // Обработчик события прокрутки
        document.addEventListener('scroll', () => {
            if (this.name) {
                const scrollTop: number = window.scrollY || document.documentElement.scrollTop;

                this.name.toArray().forEach((element: ElementRef, index: number) => {
                    const rect: DOMRect = element.nativeElement.getBoundingClientRect();
                    const elementTop: number = rect.top + scrollTop;
                    const elementBottom: number = elementTop + rect.height;

                    // Проверяем, находится ли элемент в видимой области
                    if (scrollTop >= elementTop - 100 && scrollTop < elementBottom - 100) {
                        if (this._index !== index) {
                            this._index = index;
                            this.activeService.setIndex(index);
                        }
                    }
                });
            }
        });
    }
}
