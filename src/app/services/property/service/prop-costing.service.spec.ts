import { TestBed } from '@angular/core/testing';

import { PropCostingService } from './prop-costing.service';

describe('PropCostingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PropCostingService = TestBed.get(PropCostingService);
    expect(service).toBeTruthy();
  });
});
