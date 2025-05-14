import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiEventCardComponent } from './tui-event-card.component';


describe('TuiEventCardComponent', () => {
    let component: TuiEventCardComponent;
    let fixture: ComponentFixture<TuiEventCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiEventCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiEventCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
