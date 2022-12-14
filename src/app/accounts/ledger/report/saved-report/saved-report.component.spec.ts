import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SavedReportComponent } from './saved-report.component';

describe('SavedReportComponent', () => {
  let component: SavedReportComponent;
  let fixture: ComponentFixture<SavedReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
