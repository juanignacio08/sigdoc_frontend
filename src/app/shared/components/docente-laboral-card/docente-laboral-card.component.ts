import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { DocenteLaboral } from '@shared/models/decanatura/docentelaboral.model';

@Component({
  selector: 'app-docente-laboral-card',
  imports: [CommonModule, NgbTooltip],
  templateUrl: './docente-laboral-card.component.html',
  styleUrl: './docente-laboral-card.component.scss'
})
export class DocenteLaboralCardComponent {
  @Input() data?: DocenteLaboral;

  @Output() editar = new EventEmitter<DocenteLaboral>();
  @Output() toggleEstado = new EventEmitter<DocenteLaboral>();
  @Output() delete = new EventEmitter<DocenteLaboral>();

  onEditar() {
    this.editar.emit(this.data);
  }

  onToggleEstado() {
    this.toggleEstado.emit(this.data);
  }

  onDelete() {
    this.delete.emit(this.data);
  }

  get esInactivo(): boolean {
    return this.data?.estado === 0;
  }
}
