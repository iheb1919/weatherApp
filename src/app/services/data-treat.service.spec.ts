import { TestBed } from '@angular/core/testing';

import { DataTreatService } from './data-treat.service';

describe('DataTreatService', () => {
  let service: DataTreatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataTreatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
