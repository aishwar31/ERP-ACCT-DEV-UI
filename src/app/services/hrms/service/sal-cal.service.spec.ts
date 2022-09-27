import { TestBed } from '@angular/core/testing';

import { SalCalService } from './sal-cal.service';

describe('SalCalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalCalService = TestBed.get(SalCalService);
    expect(service).toBeTruthy();
  });
});
