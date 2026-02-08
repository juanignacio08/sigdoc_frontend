import { Component, inject, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocenteacademicoService } from 'app/services/decanatura/docenteacademico.service';

@Component({
  selector: 'app-modal-pdf-viewer',
  imports: [],
  templateUrl: './modal-pdf-viewer.component.html',
  styleUrl: './modal-pdf-viewer.component.scss'
})
export class ModalPdfViewerComponent implements OnInit{

  @Input() docenteAcademicoId!: number;

  pdfUrl?: SafeResourceUrl;
  loading = true;
  error = false;

  teacherAcademicService = inject(DocenteacademicoService);

  constructor(
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadPdf();
  }

  loadPdf() {
    this.loading = true;
    this.teacherAcademicService.getPdf(this.docenteAcademicoId).subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  close() {
    this.activeModal.close();
  }

}
