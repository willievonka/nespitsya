import { Injectable, inject, DestroyRef } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Injectable()
export class ActivePanelService extends Observable<number> {
    protected activeIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);

    constructor() {
        super((subscriber: Subscriber<number>) => {
            this.activeIndex
                .pipe(takeUntilDestroyed(this._destroyRef))
                .subscribe(subscriber);
        });
    }

    /**
     * Gets the current active index.
     * @returns The current active index as a number.
     */
    public getIndex(): number {
        return this.activeIndex.value;
    }

    /**
     * Sets the active index to the specified value.
     * @param index - The new active index as a number.
     */
    public setIndex(index: number): void {
        this.activeIndex.next(index);
    }
}
