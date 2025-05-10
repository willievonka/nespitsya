import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiInputEmailComponent } from './tui-input-email.component';


describe('TuiInputEmailComponent', () => {
    let component: TuiInputEmailComponent;
    let fixture: ComponentFixture<TuiInputEmailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiInputEmailComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiInputEmailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
