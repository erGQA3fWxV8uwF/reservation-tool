import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFailComponent } from './dialog-fail.component';

describe('DialogFailComponent', () => {
  let component: DialogFailComponent;
  let fixture: ComponentFixture<DialogFailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogFailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
