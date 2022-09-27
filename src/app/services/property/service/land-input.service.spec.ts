import { TestBed } from '@angular/core/testing';

import { LandInputService } from './land-input.service';

describe('LandInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LandInputService = TestBed.get(LandInputService);
    expect(service).toBeTruthy();
  });
});
