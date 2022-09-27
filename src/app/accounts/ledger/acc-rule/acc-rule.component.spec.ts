import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AccRuleComponent } from './acc-rule.component';

describe('AccRuleComponent', () => {
  let component: AccRuleComponent;
  let fixture: ComponentFixture<AccRuleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
