import { TestBed } from '@angular/core/testing';

import { GuideService } from './guide.service';

describe('GuideService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuideService = TestBed.get(GuideService);
    expect(service).toBeTruthy();
  });
});
