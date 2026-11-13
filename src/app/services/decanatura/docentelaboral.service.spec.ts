import { TestBed } from '@angular/core/testing';

import { DocentelaboralService } from './docentelaboral.service';

describe('DocentelaboralService', () => {
  let service: DocentelaboralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocentelaboralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
