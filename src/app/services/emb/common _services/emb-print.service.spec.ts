import { TestBed } from '@angular/core/testing';

import { EmbPrintService } from './emb-print.service';

describe('EmbPrintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmbPrintService = TestBed.get(EmbPrintService);
    expect(service).toBeTruthy();
  });
});
