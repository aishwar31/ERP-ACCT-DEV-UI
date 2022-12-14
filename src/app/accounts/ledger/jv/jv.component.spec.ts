import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JvComponent } from './jv.component';

describe('JvComponent', () => {
  let component: JvComponent;
  let fixture: ComponentFixture<JvComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
