import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JrnlListingComponent } from './jrnl-listing.component';

describe('JrnlListingComponent', () => {
  let component: JrnlListingComponent;
  let fixture: ComponentFixture<JrnlListingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JrnlListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JrnlListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
