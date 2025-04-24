import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiFilterComponent } from './tui-filter.component';


describe('TuiFilterComponent', () => {
    let component: TuiFilterComponent;
    let fixture: ComponentFixture<TuiFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiFilterComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
