import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { HrAdministrationComponent } from './hr-administration.component';

describe('HrAdministrationComponent', () => {
  let component: HrAdministrationComponent;
  let fixture: ComponentFixture<HrAdministrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HrAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
