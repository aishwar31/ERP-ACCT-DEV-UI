import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ActivityHierComponent } from './activity-hier.component';

describe('ActivityHierComponent', () => {
  let component: ActivityHierComponent;
  let fixture: ComponentFixture<ActivityHierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityHierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityHierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
