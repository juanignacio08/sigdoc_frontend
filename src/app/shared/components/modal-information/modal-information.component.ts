import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Docente } from '@shared/models/decanatura/docente.model';

@Component({
  selector: 'app-modal-information',
  imports: [],
  templateUrl: './modal-information.component.html',
  styleUrl: './modal-information.component.scss'
})
export class ModalInformationComponent {
  @Input() teacher?: Docente;

  constructor (public activeModal: NgbActiveModal) {}
  
  close() {
    this.activeModal.close();
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }
}
