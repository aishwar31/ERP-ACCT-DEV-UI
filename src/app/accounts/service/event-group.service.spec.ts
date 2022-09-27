import { TestBed } from '@angular/core/testing';

import { EventGroupService } from './event-group.service';

describe('EventGroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventGroupService = TestBed.get(EventGroupService);
    expect(service).toBeTruthy();
  });
});
