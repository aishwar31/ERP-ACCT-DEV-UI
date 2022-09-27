import { TestBed } from '@angular/core/testing';

import { HistoryUploadsService } from './history-uploads.service';

describe('HistoryUploadsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HistoryUploadsService = TestBed.get(HistoryUploadsService);
    expect(service).toBeTruthy();
  });
});
