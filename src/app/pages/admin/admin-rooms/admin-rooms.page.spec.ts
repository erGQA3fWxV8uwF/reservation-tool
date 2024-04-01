import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomsPage } from './admin-rooms.page';

describe('AdminRoomsPage', () => {
  let component: AdminRoomsPage;
  let fixture: ComponentFixture<AdminRoomsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRoomsPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRoomsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
