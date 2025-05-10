import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiDropdownComponent } from './tui-dropdown.component';


describe('TuiDropdownComponent', () => {
    let component: TuiDropdownComponent;
    let fixture: ComponentFixture<TuiDropdownComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiDropdownComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiDropdownComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
