import { TestBed } from '@angular/core/testing';

import { FlashFirestoreService } from './flash-firestore.service';

describe('FlashFirestoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlashFirestoreService = TestBed.get(FlashFirestoreService);
    expect(service).toBeTruthy();
  });
});
