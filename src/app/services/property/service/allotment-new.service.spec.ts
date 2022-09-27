import { TestBed } from '@angular/core/testing';

import { AllotmentNewService } from './allotment-new.service';

describe('AllotmentNewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllotmentNewService = TestBed.get(AllotmentNewService);
    expect(service).toBeTruthy();
  });
});
