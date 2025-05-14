import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuiSecondaryButtonComponent } from './tui-secondary-button.component';

describe('TuiSecondaryButtonComponent', () => {
    let component: TuiSecondaryButtonComponent;
    let fixture: ComponentFixture<TuiSecondaryButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiSecondaryButtonComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiSecondaryButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
