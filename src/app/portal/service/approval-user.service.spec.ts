import { TestBed } from '@angular/core/testing';

import { ApprovalUserService } from './approval-user.service';

describe('ApprovalUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApprovalUserService = TestBed.get(ApprovalUserService);
    expect(service).toBeTruthy();
  });
});
