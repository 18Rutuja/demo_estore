import { TestBed } from '@angular/core/testing';

import { ApiErrorHandlingService } from './api-error-handling.service';

describe('ApiErrorHandlingService', () => {
  let service: ApiErrorHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiErrorHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
