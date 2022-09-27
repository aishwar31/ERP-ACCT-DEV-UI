import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { LedgerReportComponent } from './ledger-report.component';

describe('LedgerReportComponent', () => {
  let component: LedgerReportComponent;
  let fixture: ComponentFixture<LedgerReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
