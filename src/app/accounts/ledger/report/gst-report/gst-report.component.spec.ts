import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { GstReportComponent } from './gst-report.component';

describe('GstReportComponent', () => {
  let component: GstReportComponent;
  let fixture: ComponentFixture<GstReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GstReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
