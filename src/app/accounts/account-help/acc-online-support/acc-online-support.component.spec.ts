import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AccOnlineSupportComponent } from './acc-online-support.component';

describe('AccOnlineSupportComponent', () => {
  let component: AccOnlineSupportComponent;
  let fixture: ComponentFixture<AccOnlineSupportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccOnlineSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccOnlineSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
