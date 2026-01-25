import { TestBed } from '@angular/core/testing';

import { DocenteacademicoService } from './docenteacademico.service';

describe('DocenteacademicoService', () => {
  let service: DocenteacademicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocenteacademicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
