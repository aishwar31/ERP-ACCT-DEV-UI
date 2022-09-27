import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AccJournalComponent } from './acc-journal.component';

describe('AccJournalComponent', () => {
  let component: AccJournalComponent;
  let fixture: ComponentFixture<AccJournalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccJournalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
