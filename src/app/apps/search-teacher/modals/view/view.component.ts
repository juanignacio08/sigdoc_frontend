import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view',
  imports: [],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  @Input() data: any; // datos pasados desde search-teacher

  constructor(public activeModal: NgbActiveModal) {}

  save() {
    this.activeModal.close(/* opcional payload */);
  }

  close() {
    this.activeModal.dismiss();
  }
}
