import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExperienciaProfesional } from '@shared/models/decanatura/docenteexperiencia.model';

@Component({
  selector: 'app-work-experience',
  imports: [],
  templateUrl: './work-experience.component.html',
  styleUrl: './work-experience.component.scss',
})
export class WorkExperienceComponent {
  @Input() workExperience?: ExperienciaProfesional;
  @Output() viewPdf = new EventEmitter<ExperienciaProfesional>();

  getWorkTime() : string {
    if (this.workExperience?.fechaInicio && this.workExperience.fechaFin) {
      const [diaI, mesI, anioI] = this.workExperience?.fechaInicio
        .split('/')
        .map(Number);
      const [diaF, mesF, anioF] = this.workExperience.fechaFin
        .split('/')
        .map(Number);

      const inicio = new Date(anioI, mesI - 1, diaI);
      const fin = new Date(anioF, mesF - 1, diaF);

      let meses = (fin.getFullYear() - inicio.getFullYear()) * 12;
      meses -= inicio.getMonth();
      meses += fin.getMonth();

      const anios = Math.floor(meses / 12);
      const mesesRestantes = meses % 12;

      if (anios === 0) {
        return `${mesesRestantes} meses`;
      } else {
        return `${anios} años y ${mesesRestantes} meses`;
      }
    }

    return '---';
  }

  onviewPdf() {
    if (this.workExperience?.documento) {
      this.viewPdf.emit(this.workExperience);
    } else {
      this.viewPdf.emit(undefined);
    }
  }
}
