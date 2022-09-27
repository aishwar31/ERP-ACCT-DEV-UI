import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AccUserManualComponent } from './acc-user-manual.component';

describe('AccUserManualComponent', () => {
  let component: AccUserManualComponent;
  let fixture: ComponentFixture<AccUserManualComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccUserManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccUserManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
