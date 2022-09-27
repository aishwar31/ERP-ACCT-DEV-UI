import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AllDedReportComponent } from './all-ded-report.component';

describe('AllDedReportComponent', () => {
  let component: AllDedReportComponent;
  let fixture: ComponentFixture<AllDedReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
