import { TestBed } from '@angular/core/testing';

import { AllotmentLetterConfigurationService } from './allotment-letter-configuration.service';

describe('AllotmentLetterConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllotmentLetterConfigurationService = TestBed.get(AllotmentLetterConfigurationService);
    expect(service).toBeTruthy();
  });
});
