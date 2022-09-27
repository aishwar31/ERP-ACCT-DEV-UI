import { TestBed } from '@angular/core/testing';

import { PropCommonSService } from './prop-common-s.service';

describe('PropCommonSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PropCommonSService = TestBed.get(PropCommonSService);
    expect(service).toBeTruthy();
  });
});
