import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReservationsPage } from './admin-reservations.page';

describe('AdminReservationsPage', () => {
  let component: AdminReservationsPage;
  let fixture: ComponentFixture<AdminReservationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminReservationsPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReservationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
