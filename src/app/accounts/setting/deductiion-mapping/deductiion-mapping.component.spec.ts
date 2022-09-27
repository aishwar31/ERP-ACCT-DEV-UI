import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DeductiionMappingComponent } from './deductiion-mapping.component';

describe('DeductiionMappingComponent', () => {
  let component: DeductiionMappingComponent;
  let fixture: ComponentFixture<DeductiionMappingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeductiionMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductiionMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
