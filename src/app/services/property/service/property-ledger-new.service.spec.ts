import { TestBed } from '@angular/core/testing';

import { PropertyLedgerNewService } from './property-ledger-new.service';

describe('PropertyLedgerNewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PropertyLedgerNewService = TestBed.get(PropertyLedgerNewService);
    expect(service).toBeTruthy();
  });
});
