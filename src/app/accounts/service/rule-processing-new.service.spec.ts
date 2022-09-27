import { TestBed } from '@angular/core/testing';

import { RuleProcessingNewService } from './rule-processing-new.service';

describe('RuleProcessingNewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RuleProcessingNewService = TestBed.get(RuleProcessingNewService);
    expect(service).toBeTruthy();
  });
});
