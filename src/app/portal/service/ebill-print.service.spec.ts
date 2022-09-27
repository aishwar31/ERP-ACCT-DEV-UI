import { TestBed } from '@angular/core/testing';

import { EbillPrintService } from './ebill-print.service';

describe('EbillPrintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EbillPrintService = TestBed.get(EbillPrintService);
    expect(service).toBeTruthy();
  });
});
