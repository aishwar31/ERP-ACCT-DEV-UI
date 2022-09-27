import { TestBed } from '@angular/core/testing';

import { OrgHierService } from './org-hier.service';

describe('OrgHierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrgHierService = TestBed.get(OrgHierService);
    expect(service).toBeTruthy();
  });
});
