import { Component, inject, OnInit } from '@angular/core';
import { Docente } from '@shared/models/decanatura/docente.model';
import { SessionStorageService } from 'app/services/session-storage/session-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import {
  ExperienciaProfesional,
  ExperienciaProfesionalRequest,
} from '@shared/models/decanatura/docenteexperiencia.model';
import { ModalWorkComponent } from './modal-work/modal-work.component';
import { DocenteExperienciaLaboralCardComponent } from '@shared/components/docente-experiencia-laboral-card/docente-experiencia-laboral-card.component';
import { ExperienciaLaboralService } from '../../../services/decanatura/experiencia-laboral.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-work-experience-info',
  imports: [NgbTooltip, DocenteExperienciaLaboralCardComponent],
  templateUrl: './register-work-experience-info.component.html',
  styleUrl: './register-work-experience-info.component.scss',
})
export class RegisterWorkExperienceInfoComponent implements OnInit {
  teacherActive?: Docente | null;

  workExperienciesList: ExperienciaProfesional[] = [];
  loadingOperation: boolean = false;
  canNew: boolean = false;

  pageNumber = 0;
  pageSize = 1;
  totalItems = 0;
  pageSizeOptions = [10, 20, 50, 100];

  sessionStorageService = inject(SessionStorageService);
  profetionalExperiencieService = inject(ExperienciaLaboralService);

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

    this.loadProfetionalExperiencies(0, 10);
  }

  loadProfetionalExperiencies(page: number, size: number) {
    if (this.teacherActive) {
      this.loadingOperation = true;
      this.profetionalExperiencieService
        .getAllPage(page, size, this.teacherActive.numDocumento)
        .subscribe({
          next: (response) => {
            this.workExperienciesList = response.data;
            this.pageNumber = response.currentPage;
            this.pageSize = size;
            this.totalItems = response.totalItems;
            this.loadingOperation = false;
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
    profetionalExperience: ExperienciaProfesional | null,
  ) {
    const modalRef = this.modalService.open(ModalWorkComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    modalRef.componentInstance.teacherActive = this.teacherActive;
    if (profetionalExperience !== null) modalRef.componentInstance.workExperience = profetionalExperience;
    modalRef.componentInstance.action = action;
    modalRef.componentInstance.title = title;

    // opcional: recibir resultado cuando se cierre
    modalRef.result.then(
      (result) => {
        const experience: ExperienciaProfesionalRequest = result;
        switch (action) {
          case 'add':
            this.addProfetionalExperiencie(experience);
            break;
          case 'edit':
            this.editProfetionalExperiencie(experience);
            break;
          case 'delete':
            break;
        }
      },
      (reason) => {
        // dismissed (esc o backdrop)
        console.log('cerrado con dismissed');
      },
    );
  }

  addProfetionalExperiencie(profetionalExperiencie: ExperienciaProfesionalRequest) {
    this.loadingOperation = true;
    this.profetionalExperiencieService.save(profetionalExperiencie).subscribe({
      next: (response) => {
        console.log(response.data);
        this.loadingOperation = false;
        this.showInfo('Experiencia profesional registrado con éxito!');
        this.loadProfetionalExperiencies(0, 10);
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

  editProfetionalExperiencie(profetionalExperiencie: ExperienciaProfesionalRequest) {
    this.loadingOperation = true;
    this.profetionalExperiencieService.update(profetionalExperiencie).subscribe({
      next: (response) => {
        console.log(response.data);
        this.loadingOperation = false;
        this.showInfo('Experiencia Profesional editada!');
        this.loadProfetionalExperiencies(0, 10);
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

  delete(id: number) {
    this.loadingOperation = true;
    this.profetionalExperiencieService.delete(id).subscribe({
      next: (response) => {
        this.loadingOperation = false;
        this.showInfo('Experiencia Profesional eliminada.');
        this.loadProfetionalExperiencies(0, 10);
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

  goToNextStep() {
    if (this.teacherActive) {
      this.router.navigate(['../languages-data'], {
        relativeTo: this.route,
      });
    }
  }

  goToBackStep() {
    if (this.teacherActive) {
      this.router.navigate(['../work-data'], {
        relativeTo: this.route,
      });
    }
  }
}
