import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBookMeetingComponent } from './dialog-book-meeting.component';

describe('DialogBookMeetingComponent', () => {
  let component: DialogBookMeetingComponent;
  let fixture: ComponentFixture<DialogBookMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogBookMeetingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogBookMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
