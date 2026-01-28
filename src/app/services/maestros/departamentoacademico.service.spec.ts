import { TestBed } from '@angular/core/testing';

import { DepartamentoacademicoService } from './departamentoacademico.service';

describe('DepartamentoacademicoService', () => {
  let service: DepartamentoacademicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartamentoacademicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
