import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiInputTextComponent } from './tui-input-text.component';


describe('TuiInputTextComponent', () => {
    let component: TuiInputTextComponent;
    let fixture: ComponentFixture<TuiInputTextComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiInputTextComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiInputTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
