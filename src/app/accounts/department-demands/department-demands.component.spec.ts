import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DepartmentDemandsComponent } from './department-demands.component';

describe('DepartmentDemandsComponent', () => {
  let component: DepartmentDemandsComponent;
  let fixture: ComponentFixture<DepartmentDemandsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentDemandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentDemandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
