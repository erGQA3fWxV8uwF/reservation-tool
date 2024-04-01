import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservateUserMapComponent } from './reservate-user-map.component';

describe('ReservateUserMapComponent', () => {
  let component: ReservateUserMapComponent;
  let fixture: ComponentFixture<ReservateUserMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservateUserMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservateUserMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
