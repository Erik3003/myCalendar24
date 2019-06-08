import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFormDialogComponent } from './invite-form-dialog.component';

describe('InviteFormDialogComponent', () => {
  let component: InviteFormDialogComponent;
  let fixture: ComponentFixture<InviteFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
