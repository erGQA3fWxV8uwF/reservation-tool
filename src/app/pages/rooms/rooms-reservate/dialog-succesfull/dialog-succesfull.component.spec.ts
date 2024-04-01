import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSuccesfullComponent } from './dialog-succesfull.component';

describe('DialogSuccesfullComponent', () => {
  let component: DialogSuccesfullComponent;
  let fixture: ComponentFixture<DialogSuccesfullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSuccesfullComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSuccesfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
