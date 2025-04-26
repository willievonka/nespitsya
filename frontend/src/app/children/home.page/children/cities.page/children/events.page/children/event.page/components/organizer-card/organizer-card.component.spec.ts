import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizerCardComponent } from './organizer-card.component';


describe('OrganizerCardComponent', () => {
    let component: OrganizerCardComponent;
    let fixture: ComponentFixture<OrganizerCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [OrganizerCardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(OrganizerCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
