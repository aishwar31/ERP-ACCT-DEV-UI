import { TestBed } from '@angular/core/testing';

import { CalRuleService } from './cal-rule.service';

describe('CalRuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalRuleService = TestBed.get(CalRuleService);
    expect(service).toBeTruthy();
  });
});
