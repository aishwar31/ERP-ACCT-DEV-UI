import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PartyReportComponent } from './party-report.component';

describe('PartyReportComponent', () => {
  let component: PartyReportComponent;
  let fixture: ComponentFixture<PartyReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PartyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
