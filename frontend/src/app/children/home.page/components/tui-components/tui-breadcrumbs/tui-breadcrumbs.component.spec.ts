import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuiBreadcrumbsComponent } from './tui-breadcrumbs.component';

describe('TuiBreadcrumbsComponent', () => {
    let component: TuiBreadcrumbsComponent;
    let fixture: ComponentFixture<TuiBreadcrumbsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TuiBreadcrumbsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TuiBreadcrumbsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
