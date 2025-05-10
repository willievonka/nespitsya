import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuiChipComponent } from './tui-chip.component';

describe('TuiChipComponent', () => {
    let component: TuiChipComponent;
    let fixture: ComponentFixture<TuiChipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiChipComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiChipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
