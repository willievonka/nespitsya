import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopularCitiesListComponent } from './popular-cities-list.component';


describe('PopularCitiesListComponent', () => {
    let component: PopularCitiesListComponent;
    let fixture: ComponentFixture<PopularCitiesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PopularCitiesListComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PopularCitiesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
