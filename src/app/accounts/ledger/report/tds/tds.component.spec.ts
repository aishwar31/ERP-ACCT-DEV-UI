import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TdsComponent } from './tds.component';

describe('TdsComponent', () => {
  let component: TdsComponent;
  let fixture: ComponentFixture<TdsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
