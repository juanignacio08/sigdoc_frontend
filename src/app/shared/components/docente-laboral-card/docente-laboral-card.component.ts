import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { DocenteLaboral } from '@shared/models/decanatura/docentelaboral.model';
import { ModalPdfViewerComponent } from '../modal-pdf-viewer/modal-pdf-viewer.component';

@Component({
  selector: 'app-docente-laboral-card',
  imports: [CommonModule, NgbTooltip],
  templateUrl: './docente-laboral-card.component.html',
  styleUrl: './docente-laboral-card.component.scss',
})
export class DocenteLaboralCardComponent {
  @Input() data?: DocenteLaboral;

  @Output() editar = new EventEmitter<DocenteLaboral>();
  @Output() toggleEstado = new EventEmitter<DocenteLaboral>();
  @Output() delete = new EventEmitter<DocenteLaboral>();

  constructor(
    private modalService: NgbModal,
  ) {}

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

  openPdfModal(teacherWorkId: number) {
    const modalRef = this.modalService.open(ModalPdfViewerComponent, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    modalRef.componentInstance.docenteLaboralId = teacherWorkId;
  }
}
