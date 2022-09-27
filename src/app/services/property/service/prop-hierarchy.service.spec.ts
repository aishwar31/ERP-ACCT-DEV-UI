import { TestBed } from '@angular/core/testing';

import { PropHierarchyService } from './prop-hierarchy.service';

describe('PropHierarchyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PropHierarchyService = TestBed.get(PropHierarchyService);
    expect(service).toBeTruthy();
  });
});
