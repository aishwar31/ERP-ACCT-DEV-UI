import { TestBed } from '@angular/core/testing';

import { CdPrintService } from './cd-print.service';

describe('CdPrintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CdPrintService = TestBed.get(CdPrintService);
    expect(service).toBeTruthy();
  });
});
