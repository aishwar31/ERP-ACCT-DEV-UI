import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { EventLayoutsComponent } from './event-layouts.component';

describe('EventLayoutsComponent', () => {
  let component: EventLayoutsComponent;
  let fixture: ComponentFixture<EventLayoutsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLayoutsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
