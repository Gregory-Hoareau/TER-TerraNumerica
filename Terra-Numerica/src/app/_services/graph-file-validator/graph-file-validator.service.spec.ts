import { TestBed } from '@angular/core/testing';

import { GraphFileValidatorService } from './graph-file-validator.service';

describe('GraphFileValidatorService', () => {
  let service: GraphFileValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphFileValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
