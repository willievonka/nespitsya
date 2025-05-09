import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiCarouselComponent } from './tui-carousel.component';


describe('TuiCarouselComponent', () => {
    let component: TuiCarouselComponent;
    let fixture: ComponentFixture<TuiCarouselComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiCarouselComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiCarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
