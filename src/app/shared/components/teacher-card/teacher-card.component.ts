import { Component, Input, OnInit } from '@angular/core';
import { Docente } from '@shared/models/decanatura/docente.model';
import { DocenteAcademico } from '@shared/models/decanatura/docenteacademico.model';

@Component({
  selector: 'app-teacher-card',
  imports: [],
  templateUrl: './teacher-card.component.html',
  styleUrl: './teacher-card.component.scss'
})
export class TeacherCardComponent {
  private _teacher!: Docente;
  profession?: DocenteAcademico;

  @Input() set teacher(value: Docente) {
    if (value) {
      this._teacher = value;
      // Asignamos la profesión apenas llega el docente
      this.profession = value.infoAcademica?.[0];
    }
  }

  get teacher(): Docente {
    return this._teacher;
  }
}
