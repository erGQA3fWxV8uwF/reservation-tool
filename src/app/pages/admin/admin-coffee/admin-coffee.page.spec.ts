import { ComponentFixture, TestBed } from '@angular/core/testing';


import { AdminCoffeePage } from './admin-coffee.page';

describe('AdminCoffeePage', () => {
  let component: AdminCoffeePage;
  let fixture: ComponentFixture<AdminCoffeePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCoffeePage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCoffeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
