import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Docente } from '@shared/models/decanatura/docente.model';
import { SessionStorageService } from 'app/services/session-storage/session-storage.service';
import { ModalWorkInfoComponent } from './modal-work-info/modal-work-info.component';
import { DocentelaboralService } from 'app/services/decanatura/docentelaboral.service';
import {
  DocenteLaboral,
  DocenteLaboralRequest,
} from '@shared/models/decanatura/docentelaboral.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { DocenteLaboralCardComponent } from '@shared/components/docente-laboral-card/docente-laboral-card.component';

@Component({
  selector: 'app-register-work-info',
  imports: [NgbTooltip, CommonModule, DocenteLaboralCardComponent],
  templateUrl: './register-work-info.component.html',
  styleUrl: './register-work-info.component.scss',
})
export class RegisterWorkInfoComponent implements OnInit {
  teacherActive?: Docente | null;

  workTeacherList: DocenteLaboral[] = [];
  loadingOperation: boolean = false;
  canNew: boolean = false;

  pageNumber = 0;
  pageSize = 1;
  totalItems = 0;
  pageSizeOptions = [10, 20, 50, 100];

  sessionStorageService = inject(SessionStorageService);
  workTeacherService = inject(DocentelaboralService);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.teacherActive =
      this.sessionStorageService.get<Docente>('teacherActive');
    if (!this.teacherActive) {
      this.router.navigate(['/apps/register-teacher/personal-data']);
      return;
    }

    this.loadWorkTeacher(0, 10);
  }

  loadWorkTeacher(page: number, size: number) {
    if (this.teacherActive) {
      this.loadingOperation = true;
      this.workTeacherService
        .getAllPage(page, size, this.teacherActive.numDocumento)
        .subscribe({
          next: (response) => {
            this.workTeacherList = response.data;
            this.pageNumber = response.currentPage;
            this.pageSize = size;
            this.totalItems = response.totalItems;
            this.loadingOperation = false;
            this.canNew = this.canNewAdd;
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

  showError(message: string) {
    this.toastr.error(message, 'Error!');
  }

  showInfo(message: string) {
    this.toastr.info(message, 'Información');
  }

  openModalWork(
    action: string,
    title: string,
    teacherWork: DocenteLaboral | null,
  ) {
    const modalRef = this.modalService.open(ModalWorkInfoComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    modalRef.componentInstance.teacherActive = this.teacherActive;
    if (teacherWork !== null)
      modalRef.componentInstance.teacherWork = teacherWork;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.title = title;

    // opcional: recibir resultado cuando se cierre
    modalRef.result.then(
      (result) => {
        const { data, file } = result;
        switch (action) {
          case 'add':
            this.addWorkTeacher(data, file);
            break;
          case 'edit':
            this.editWorkTeacher(data, file);
            break;
          case 'delete':
            this.delete(data.docenteLaboralId);
            break;
        }
      },
      (reason) => {
        // dismissed (esc o backdrop)
        console.log('cerrado con dismissed');
      },
    );
  }

  addWorkTeacher(workTeacher: DocenteLaboralRequest, file?: File) {
    this.loadingOperation = true;
    this.workTeacherService.save(workTeacher, file).subscribe({
      next: (response) => {
        this.loadingOperation = false;
        this.showInfo('Información laboral registrado con éxito!');
        this.loadWorkTeacher(0, 10);
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

  editWorkTeacher(workTeacher: DocenteLaboralRequest, file?: File) {
    this.loadingOperation = true;
    this.workTeacherService.update(workTeacher, file).subscribe({
      next: (response) => {
        this.loadingOperation = false;
        this.showInfo('Información laboral editada!');
        this.loadWorkTeacher(0, 10);
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

  darBaja(workTeacherId: number) {
    this.loadingOperation = true;
    this.workTeacherService.disabled(workTeacherId).subscribe({
      next: (response) => {
        this.loadingOperation = false;
        this.showInfo('Información laboral inactiva!');
        this.loadWorkTeacher(0, 10);
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

  darAlta(workTeacherId: number) {
    this.loadingOperation = true;
    this.workTeacherService.enabled(workTeacherId).subscribe({
      next: (response) => {
        this.loadingOperation = false;
        this.showInfo('Información laboral activa!');
        this.loadWorkTeacher(0, 10);
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

  delete(workTeacherId: number) {
    this.loadingOperation = true;
    this.workTeacherService.delete(workTeacherId).subscribe({
      next: (response) => {
        this.loadingOperation = false;
        this.showInfo('Información laboral eliminada.');
        this.loadWorkTeacher(0, 10);
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

  toggleStatus(workTeacher: DocenteLaboral) {
    if (workTeacher.estado === 1) {
      this.darBaja(workTeacher.docenteLaboralId);
      return;
    }

    this.darAlta(workTeacher.docenteLaboralId);
  }

  goToNextStep() {
    if (this.teacherActive) {
      this.router.navigate(['../work-experience-data'], {
        relativeTo: this.route,
      });
    }
  }

  goToBackStep() {
    if (this.teacherActive) {
      this.router.navigate(['../academic-data'], {
        relativeTo: this.route,
      });
    }
  }

  get canNewAdd(): boolean {
    return this.workTeacherList.every((item) => item.estado === 0);
  }

}
