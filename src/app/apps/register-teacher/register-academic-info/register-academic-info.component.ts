import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Docente } from '@shared/models/decanatura/docente.model';
import { TablaMaestraService } from 'app/services/maestros/tabla-maestra.service';
import { SessionStorageService } from 'app/services/session-storage/session-storage.service';
import {
  DatatableComponent,
  NgxDatatableModule,
} from '@swimlane/ngx-datatable';
import {
  DocenteAcademico,
  DocenteAcademicoRequest,
} from '@shared/models/decanatura/docenteacademico.model';
import { DocenteacademicoService } from '../../../services/decanatura/docenteacademico.service';
import { ModalAcademicComponent } from './modal-academic/modal-academic.component';
import { ModalPdfViewerComponent } from '@shared/components/modal-pdf-viewer/modal-pdf-viewer.component';

@Component({
  selector: 'app-register-academic-info',
  imports: [NgxDatatableModule, NgbTooltip],
  templateUrl: './register-academic-info.component.html',
  styleUrl: './register-academic-info.component.scss',
})
export class RegisterAcademicInfoComponent implements OnInit {
  teacherActive?: Docente | null;
  academicGradeList: DocenteAcademico[] = [];

  pageNumber = 0;
  pageSize = 1;
  totalItems = 0;
  pageSizeOptions = [10, 20, 50, 100];

  loadingOperation = false;
  loadingIndicator = true;
  reorderable = false;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent;

  masterTableService = inject(TablaMaestraService);
  sessionStorageService = inject(SessionStorageService);
  teacherAcademicService = inject(DocenteacademicoService);

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.teacherActive =
      this.sessionStorageService.get<Docente>('teacherActive');
    if (!this.teacherActive) {
      this.router.navigate(['/apps/register-teacher/personal-data']);
      return;
    }

    this.loadAcademicsGrades(0, 10);
  }

  loadAcademicsGrades(page: number, size: number) {
    if (this.teacherActive) {
      this.loadingIndicator = true;
      this.teacherAcademicService
        .getAllPage(page, size, this.teacherActive.numDocumento)
        .subscribe({
          next: (response) => {
            this.academicGradeList = response.data;
            this.pageNumber = response.currentPage;
            this.pageSize = size;
            this.totalItems = response.totalItems;
            this.loadingIndicator = false;
          },
          error: (err) => {
            this.loadingOperation = false;
            if ([409, 400, 404, 500].includes(err.error.status)) {
              this.showError(err.error.detail);
            } else {
              this.showError('Error desconocido. Intentelo de nuevo...');
            }
          },
        });
    }
  }

  openModalInformative(
    action: string,
    title: string,
    teacherAcademic: DocenteAcademico | null,
  ) {
    const modalRef = this.modalService.open(ModalAcademicComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    modalRef.componentInstance.teacherActive = this.teacherActive;
    if (teacherAcademic !== null) modalRef.componentInstance.teacherAcademic = teacherAcademic;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.title = title;

    // opcional: recibir resultado cuando se cierre
    modalRef.result.then(
      (result) => {
        const { data, file } = result;
        switch (action) {
          case 'add':
            this.addAcademicTeacher(data, file);
            break;
          case 'edit':
            this.editAcademicTeacher(data, file);
            break;
          case 'delete':
            this.deleteAcademicTeacher(data.docenteAcademicoId);
            break;
        }
      },
      (reason) => {
        // dismissed (esc o backdrop)
        console.log('cerrado con dismissed');
      },
    );
  }

  addAcademicTeacher(academicTeacher: DocenteAcademicoRequest, file?: File) {
    this.loadingOperation = true;
    this.teacherAcademicService.save(academicTeacher, file).subscribe({
      next: (response) => {
        this.loadingOperation = false;
        this.showInfo('Grado Académico registrado con éxito!');
        this.loadAcademicsGrades(0, 10);
      },
      error: (err) => {
        this.loadingOperation = false;
        this.showError(err.error?.detail || 'Error desconocido');
      },
    });
  }

  editAcademicTeacher(academicTeacher: DocenteAcademicoRequest, file?: File) {
    this.loadingOperation = true;
    this.teacherAcademicService.update(academicTeacher, file).subscribe({
      next: (response) => {
        this.loadingOperation = false;
        this.showInfo('Grado Académico editado con éxito!');
        this.loadAcademicsGrades(0, 10);
      },
      error: (err) => {
        this.loadingOperation = false;
        if ([409, 400, 404, 500].includes(err.error.status)) {
          this.showError(err.error.detail);
        } else {
          this.showError('Error desconocido. Intentelo de nuevo...');
        }
      },
    });
  }

  deleteAcademicTeacher(academicTeacherId: number) {
    this.loadingOperation = true;
    this.teacherAcademicService.delete(academicTeacherId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.loadingOperation = false;
        this.showInfo('Grado Académico eliminado!');
        this.loadAcademicsGrades(0, 10);
      },
      error: (err) => {
        this.loadingOperation = false;
        if ([409, 400, 404, 500].includes(err.error.status)) {
          this.showError(err.error.detail);
        } else {
          this.showError('Error desconocido. Intentelo de nuevo...');
        }
      },
    });
  }

  showError(message: string) {
    this.toastr.error(message, 'Error!');
  }

  showInfo(message: string) {
    this.toastr.info(message, 'Información');
  }

  goToNextStep() {
    if (this.teacherActive) {
      this.router.navigate(['../work-data'], {
        relativeTo: this.route,
      });
    }
  }

  goToBackStep() {
    if (this.teacherActive) {
      this.router.navigate(['../personal-data'], {
        relativeTo: this.route,
      });
    }
  }

  openPdfModal(teacherAcademicId: number) {
    const modalRef = this.modalService.open(ModalPdfViewerComponent, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    modalRef.componentInstance.docenteAcademicoId = teacherAcademicId;
  }

  onPage(event: any) {
    this.pageNumber = event.offset;
    this.loadAcademicsGrades(this.pageNumber, this.pageSize);
  }

}
