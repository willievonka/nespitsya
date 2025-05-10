import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiAppearance, TuiIcon } from '@taiga-ui/core';
import { TuiCarousel, TuiPagination } from '@taiga-ui/kit';
import { TuiEventCardComponent } from '../../../../../components/tui-components/tui-event-card/tui-event-card.component';
import { IEvent } from '../../../interfaces/event.interface';


@Component({
    selector: 'app-tui-carousel',
    imports: [
        CommonModule,
        TuiCarousel,
        TuiPagination,
        TuiAppearance,
        TuiIcon,
        TuiEventCardComponent,
    ],
    templateUrl: './tui-carousel.component.html',
    styleUrl: './tui-carousel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TuiCarouselComponent {
    @Input()
    public itemsPerPage: number = 3;

    @Input()
    public items: IEvent[] = [];

    /**
     * Returns the current page index for pagination based on the current item index and items per page.
     */
    protected get paginationIndex(): number {
        return Math.floor(this.index / this.itemsPerPage);
    }

    
    /**
     * Returns the total number of pages based on the number of items and items per page.
     */
    protected get pageCount(): number {
        return Math.ceil(this.items.length / this.itemsPerPage);
    }

    protected index: number = 0;
    
    /**
     * Sets the current index based on the selected page index and items per page.
     * @param index The selected page index.
     */
    protected onIndex(index: number): void {
        this.index = index * this.itemsPerPage;
    }

    
    /**
     * Moves the carousel to the previous set of items.
     */
    protected prev(): void {
        this.index = Math.max(0, this.index - this.itemsPerPage);
    }

    
    /**
     * Moves the carousel to the next set of items.
     */
    protected next(): void {
        if (this.items.length % this.itemsPerPage === 0) {
            this.index = Math.min(this.items.length - this.itemsPerPage, this.index + this.itemsPerPage);
        } else {
            this.index = Math.min(this.items.length - (this.items.length % this.itemsPerPage), this.index + this.itemsPerPage);
        }
    }
}
