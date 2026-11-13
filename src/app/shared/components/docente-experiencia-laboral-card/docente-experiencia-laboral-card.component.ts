import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ExperienciaProfesional } from '@shared/models/decanatura/docenteexperiencia.model';

@Component({
  selector: 'app-docente-experiencia-laboral-card',
  imports: [CommonModule, NgbTooltip],
  templateUrl: './docente-experiencia-laboral-card.component.html',
  styleUrl: './docente-experiencia-laboral-card.component.scss',
})
export class DocenteExperienciaLaboralCardComponent {
  @Input() data?: ExperienciaProfesional;

  @Output() editar = new EventEmitter<ExperienciaProfesional>();
  @Output() delete = new EventEmitter<ExperienciaProfesional>();
  @Output() viewPdf = new EventEmitter<ExperienciaProfesional>();

  onEditar() {
    this.editar.emit(this.data);
  }

  onDelete() {
    this.delete.emit(this.data);
  }

  onViewPDF() {
    this.viewPdf.emit(this.data);
  }

}
