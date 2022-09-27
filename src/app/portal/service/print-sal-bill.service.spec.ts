import { TestBed } from '@angular/core/testing';

import { PrintSalBillService } from './print-sal-bill.service';

describe('PrintSalBillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrintSalBillService = TestBed.get(PrintSalBillService);
    expect(service).toBeTruthy();
  });
});
