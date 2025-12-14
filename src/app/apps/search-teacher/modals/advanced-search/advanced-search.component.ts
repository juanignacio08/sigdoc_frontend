import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-advanced-search',
  imports: [],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss'
})
export class AdvancedSearchComponent {
  @Input() data: any; // datos pasados desde search-teacher

  constructor(public activeModal: NgbActiveModal) {}

  save() {
    this.activeModal.close(/* opcional payload */);
  }

  close() {
    this.activeModal.dismiss();
  }
}
