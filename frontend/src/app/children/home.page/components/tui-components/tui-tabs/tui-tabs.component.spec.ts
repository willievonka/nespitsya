import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TuiTabsComponent } from './tui-tabs.component';


describe('TuiTabsComponent', () => {
    let component: TuiTabsComponent;
    let fixture: ComponentFixture<TuiTabsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiTabsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
