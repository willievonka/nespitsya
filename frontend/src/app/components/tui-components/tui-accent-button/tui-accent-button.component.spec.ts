import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuiAccentButtonComponent } from './tui-accent-button.component';

describe('TuiAccentButtonComponent', () => {
    let component: TuiAccentButtonComponent;
    let fixture: ComponentFixture<TuiAccentButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiAccentButtonComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiAccentButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
