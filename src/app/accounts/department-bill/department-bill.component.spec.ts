import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DepartmentBillComponent } from './department-bill.component';

describe('DepartmentBillComponent', () => {
  let component: DepartmentBillComponent;
  let fixture: ComponentFixture<DepartmentBillComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
