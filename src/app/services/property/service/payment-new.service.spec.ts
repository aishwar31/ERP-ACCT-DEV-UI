import { TestBed } from '@angular/core/testing';

import { PaymentNewService } from './payment-new.service';

describe('PaymentNewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentNewService = TestBed.get(PaymentNewService);
    expect(service).toBeTruthy();
  });
});
