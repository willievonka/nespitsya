import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuiInputSearchComponent } from './tui-input-search.component';

describe('TuiInputSearchComponent', () => {
    let component: TuiInputSearchComponent;
    let fixture: ComponentFixture<TuiInputSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiInputSearchComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiInputSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
