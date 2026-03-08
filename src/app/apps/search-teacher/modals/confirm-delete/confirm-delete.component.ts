import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Docente } from '@shared/models/decanatura/docente.model';

@Component({
  selector: 'app-confirm-delete',
  imports: [],
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss',
})
export class ConfirmDeleteComponent implements OnInit{

  @Input() teacherActive?: Docente;

  constructor(
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    
  }

  confirmDelete() {
    if (this.teacherActive) {
      this.activeModal.close(this.teacherActive.numDocumento)
      
      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      });
    }
  }

  close() {
    this.activeModal.dismiss();
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

}
