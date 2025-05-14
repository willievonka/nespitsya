import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuiFlatButtonComponent } from './tui-flat-button.component';

describe('TuiFlatButtonComponent', () => {
    let component: TuiFlatButtonComponent;
    let fixture: ComponentFixture<TuiFlatButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiFlatButtonComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiFlatButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
