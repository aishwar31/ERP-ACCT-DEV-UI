import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AccTutorialComponent } from './acc-tutorial.component';

describe('AccTutorialComponent', () => {
  let component: AccTutorialComponent;
  let fixture: ComponentFixture<AccTutorialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccTutorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
