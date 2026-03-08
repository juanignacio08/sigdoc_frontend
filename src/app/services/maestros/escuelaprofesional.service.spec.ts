import { TestBed } from '@angular/core/testing';

import { EscuelaprofesionalService } from './escuelaprofesional.service';

describe('EscuelaprofesionalService', () => {
  let service: EscuelaprofesionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EscuelaprofesionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
