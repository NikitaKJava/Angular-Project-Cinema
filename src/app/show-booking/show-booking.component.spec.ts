import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowBookingComponent } from './show-booking.component';

describe('ShowBookingComponent', () => {
  let component: ShowBookingComponent;
  let fixture: ComponentFixture<ShowBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowBookingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
