import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopularCityButtonComponent } from './popular-city-button.component';


describe('PopularCityButtonComponent', () => {
    let component: PopularCityButtonComponent;
    let fixture: ComponentFixture<PopularCityButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopularCityButtonComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PopularCityButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
