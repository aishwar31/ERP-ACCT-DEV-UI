import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { OrgHierComponent } from './org-hier.component';

describe('OrgHierComponent', () => {
  let component: OrgHierComponent;
  let fixture: ComponentFixture<OrgHierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrgHierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgHierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
