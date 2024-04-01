import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservateHoursOverviewComponent } from './reservate-hours-overview.component';

describe('ReservateHoursOverviewComponent', () => {
  let component: ReservateHoursOverviewComponent;
  let fixture: ComponentFixture<ReservateHoursOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservateHoursOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservateHoursOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
