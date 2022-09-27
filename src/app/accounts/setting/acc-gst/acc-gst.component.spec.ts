import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AccGstComponent } from './acc-gst.component';

describe('AccGstComponent', () => {
  let component: AccGstComponent;
  let fixture: ComponentFixture<AccGstComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccGstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
