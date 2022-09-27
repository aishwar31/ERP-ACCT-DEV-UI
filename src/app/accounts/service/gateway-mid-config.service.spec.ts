import { TestBed } from '@angular/core/testing';

import { GatewayMidConfigService } from './gateway-mid-config.service';

describe('GatewayMidConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GatewayMidConfigService = TestBed.get(GatewayMidConfigService);
    expect(service).toBeTruthy();
  });
});
