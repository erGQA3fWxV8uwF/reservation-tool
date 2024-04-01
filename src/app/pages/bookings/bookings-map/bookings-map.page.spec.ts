import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsMapPage } from './bookings-map.page';

describe('BookingsMapPage', () => {
  let component: BookingsMapPage;
  let fixture: ComponentFixture<BookingsMapPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingsMapPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingsMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
