import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ChartOfAccMappingComponent } from './chart-of-acc-mapping.component';

describe('ChartOfAccMappingComponent', () => {
  let component: ChartOfAccMappingComponent;
  let fixture: ComponentFixture<ChartOfAccMappingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOfAccMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOfAccMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
