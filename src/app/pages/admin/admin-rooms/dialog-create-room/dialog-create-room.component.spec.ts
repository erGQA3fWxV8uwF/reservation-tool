import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateRoomComponent } from './dialog-create-room.component';

describe('DialogCreateRoomComponent', () => {
  let component: DialogCreateRoomComponent;
  let fixture: ComponentFixture<DialogCreateRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreateRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
