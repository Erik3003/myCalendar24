import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfcalendarComponent } from './selfcalendar.component';

describe('SelfcalendarComponent', () => {
  let component: SelfcalendarComponent;
  let fixture: ComponentFixture<SelfcalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelfcalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfcalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
