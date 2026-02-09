import { Component, inject, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocenteacademicoService } from 'app/services/decanatura/docenteacademico.service';
import { DocentelaboralService } from 'app/services/decanatura/docentelaboral.service';

@Component({
  selector: 'app-modal-pdf-viewer',
  imports: [],
  templateUrl: './modal-pdf-viewer.component.html',
  styleUrl: './modal-pdf-viewer.component.scss'
})
export class ModalPdfViewerComponent implements OnInit{

  @Input() docenteAcademicoId?: number;
  @Input() docenteLaboralId?: number;

  pdfUrl?: SafeResourceUrl;
  loading = true;
  error = false;

  teacherAcademicService = inject(DocenteacademicoService);
  teacherWorkService = inject(DocentelaboralService);

  constructor(
    public activeModal: NgbActiveModal,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadPdf();
  }

  loadPdf() {
    if (this.docenteAcademicoId) {
      this.loadPdfAcademic();
      return;
    }

    if (this.docenteLaboralId) {
      this.loadPdfWork();
      return;
    }
  }

  loadPdfAcademic() {
    this.loading = true;
    this.teacherAcademicService.getPdf(this.docenteAcademicoId || 0).subscribe({
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

  loadPdfWork() {
    this.loading = true;
    this.teacherWorkService.getPdf(this.docenteLaboralId || 0).subscribe({
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
