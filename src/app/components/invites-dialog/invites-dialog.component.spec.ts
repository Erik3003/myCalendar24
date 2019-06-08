import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitesDialogComponent } from './invites-dialog.component';

describe('InvitesDialogComponent', () => {
  let component: InvitesDialogComponent;
  let fixture: ComponentFixture<InvitesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
