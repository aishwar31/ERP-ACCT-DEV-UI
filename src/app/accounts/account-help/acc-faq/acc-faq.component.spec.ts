import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AccFaqComponent } from './acc-faq.component';

describe('AccFaqComponent', () => {
  let component: AccFaqComponent;
  let fixture: ComponentFixture<AccFaqComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
