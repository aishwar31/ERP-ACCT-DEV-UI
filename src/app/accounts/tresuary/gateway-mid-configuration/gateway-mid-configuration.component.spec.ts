import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { GatewayMIDConfigurationComponent } from './gateway-mid-configuration.component';

describe('GatewayMIDConfigurationComponent', () => {
  let component: GatewayMIDConfigurationComponent;
  let fixture: ComponentFixture<GatewayMIDConfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayMIDConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayMIDConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
