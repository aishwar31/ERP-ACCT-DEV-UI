import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ArrListingComponent } from './arr-listing.component';

describe('ArrListingComponent', () => {
  let component: ArrListingComponent;
  let fixture: ComponentFixture<ArrListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
