import { TestBed } from '@angular/core/testing';

import { HrHierService } from './hr-hier.service';

describe('HrHierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HrHierService = TestBed.get(HrHierService);
    expect(service).toBeTruthy();
  });
});
