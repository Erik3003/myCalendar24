import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeCategoriesComponent } from './customize-categories.component';

describe('CustomizeCategoriesComponent', () => {
  let component: CustomizeCategoriesComponent;
  let fixture: ComponentFixture<CustomizeCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
