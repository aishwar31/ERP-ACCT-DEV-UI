import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BankReportComponent } from './bank-report.component';

describe('BankReportComponent', () => {
  let component: BankReportComponent;
  let fixture: ComponentFixture<BankReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BankReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
