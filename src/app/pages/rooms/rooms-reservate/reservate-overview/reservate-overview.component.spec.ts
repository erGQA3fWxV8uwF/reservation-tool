import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservateOverviewComponent } from './reservate-overview.component';

describe('ReservateOverviewComponent', () => {
  let component: ReservateOverviewComponent;
  let fixture: ComponentFixture<ReservateOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservateOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservateOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
