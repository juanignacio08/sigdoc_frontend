import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteExperienciaLaboralCardComponent } from './docente-experiencia-laboral-card.component';

describe('DocenteExperienciaLaboralCardComponent', () => {
  let component: DocenteExperienciaLaboralCardComponent;
  let fixture: ComponentFixture<DocenteExperienciaLaboralCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteExperienciaLaboralCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteExperienciaLaboralCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
