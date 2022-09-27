import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DepartmentPaymentComponent } from './department-payment.component';

describe('DepartmentPaymentComponent', () => {
  let component: DepartmentPaymentComponent;
  let fixture: ComponentFixture<DepartmentPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
