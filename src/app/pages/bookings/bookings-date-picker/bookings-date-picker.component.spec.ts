import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsDatePickerComponent } from './bookings-date-picker.component';

describe('BookingsDatePickerComponent', () => {
  let component: BookingsDatePickerComponent;
  let fixture: ComponentFixture<BookingsDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingsDatePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingsDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
