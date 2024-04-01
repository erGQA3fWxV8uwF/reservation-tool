import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteRoomComponent } from './dialog-delete-room.component';

describe('DialogDeleteRoomComponent', () => {
  let component: DialogDeleteRoomComponent;
  let fixture: ComponentFixture<DialogDeleteRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeleteRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeleteRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
