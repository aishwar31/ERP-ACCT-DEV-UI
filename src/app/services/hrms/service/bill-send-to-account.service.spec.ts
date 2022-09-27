import { TestBed } from '@angular/core/testing';

import { BillSendToAccountService } from './bill-send-to-account.service';

describe('BillSendToAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillSendToAccountService = TestBed.get(BillSendToAccountService);
    expect(service).toBeTruthy();
  });
});
