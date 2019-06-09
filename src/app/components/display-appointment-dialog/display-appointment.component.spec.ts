import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAppointmentComponent } from './display-appointment.component';

describe('DisplayAppointmentComponent', () => {
  let component: DisplayAppointmentComponent;
  let fixture: ComponentFixture<DisplayAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
