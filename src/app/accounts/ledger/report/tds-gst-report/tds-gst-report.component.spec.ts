import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TdsGstReportComponent } from './tds-gst-report.component';

describe('TdsGstReportComponent', () => {
  let component: TdsGstReportComponent;
  let fixture: ComponentFixture<TdsGstReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TdsGstReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsGstReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
