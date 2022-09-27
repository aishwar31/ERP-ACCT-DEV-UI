import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AccSalComponent } from './acc-sal.component';

describe('AccSalComponent', () => {
  let component: AccSalComponent;
  let fixture: ComponentFixture<AccSalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccSalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
