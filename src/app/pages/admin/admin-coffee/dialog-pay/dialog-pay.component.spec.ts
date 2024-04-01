import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPayComponent } from './dialog-pay.component';

describe('DialogPayComponent', () => {
  let component: DialogPayComponent;
  let fixture: ComponentFixture<DialogPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
