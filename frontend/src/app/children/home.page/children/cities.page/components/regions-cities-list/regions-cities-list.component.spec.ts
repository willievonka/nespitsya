import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionsCitiesListComponent } from './regions-cities-list.component';


describe('RegionsCitiesListComponent', () => {
    let component: RegionsCitiesListComponent;
    let fixture: ComponentFixture<RegionsCitiesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegionsCitiesListComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RegionsCitiesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
