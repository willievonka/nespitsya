import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiActiveZone, TuiDay, TuiDayRange, TuiObscured } from '@taiga-ui/cdk';
import { TuiButton, TuiCalendar, TuiDropdown, TuiMarkerHandler } from '@taiga-ui/core';
import { TuiChevron } from '@taiga-ui/kit';
import { getMarkerHandler, mapAndSortDates } from './utils/date-filter.utils';


const calendarDot: [string] = ['var(--tui-status-neutral)'];

@Component({
    selector: 'app-date-filter',
    imports: [
        CommonModule,
        TuiButton,
        TuiCalendar,
        TuiChevron,
        TuiDropdown,
        TuiActiveZone,
        TuiObscured,
    ],
    templateUrl: './date-filter.component.html',
    styleUrl: './date-filter.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFilterComponent {
    @Input()
    public label: string = 'Дата';

    @Output()
    public dateChange: EventEmitter<TuiDayRange | null> = new EventEmitter<TuiDayRange | null>();
    
    /**
     * Sets the list of dates as Date objects and converts them to TuiDay instances.
     * @param dates - An array of Date objects.
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @Input()
    public set dates(dates: Date[]) {
        this._dates = mapAndSortDates(dates);
        this.markerHandler = getMarkerHandler(this._dates, calendarDot);
    }

    /**
     * Gets the list of dates as TuiDay instances.
     */
    public get dates(): TuiDay[] {
        return this._dates;
    }
    
    /**
     * Returns true if a date range is selected (from and to are not the same day).
     */
    protected get isAnyChecked(): boolean {
        return !!this.value;
    }

    /**
     * Returns today's date as a TuiDay instance.
     */
    protected get today(): TuiDay {
        const now: Date = new Date();
        
        return new TuiDay(now.getFullYear(), now.getMonth(), now.getDate());
    }
    
    protected open: boolean = false;
    protected value: TuiDayRange | null = null;
    protected hoveredItem: TuiDay | null = null;
    private _dates: TuiDay[] = [];
    protected markerHandler: TuiMarkerHandler = () => [];
    
    /**
     * Handles the click event on a day in the calendar.
     * @param day - The day that was clicked.
     */
    protected onDayClick(day: TuiDay): void {
        if (!this.value?.isSingleDay) {
            this.value = new TuiDayRange(day, day);
        } else {
            this.value = TuiDayRange.sort(this.value.from, day);
        }
        this.dateChange.emit(this.value);
    }

    /**
     * Toggles the dropdown open state.
     */
    protected toggleDropdown(): void {
        this.open = !this.open;
    }
 
    /**
     * Handles the obscured state of the dropdown.
     * @param obscured - A boolean indicating if the dropdown is obscured.
     */
    protected handleObscured(obscured: boolean): void {
        if (obscured) {
            this.open = false;
        }
    }
 
    /**
     * Handles the active zone state of the dropdown.
     * @param active - A boolean indicating if the dropdown is in the active zone.
     */
    protected handleActiveZone(active: boolean): void {
        this.open = active && this.open;
    }
}
