import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiOutlineButtonComponent } from './tui-outline-button.component';


describe('TuiOutlineButtonComponent', () => {
    let component: TuiOutlineButtonComponent;
    let fixture: ComponentFixture<TuiOutlineButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiOutlineButtonComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiOutlineButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
