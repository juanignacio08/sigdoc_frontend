import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgbModal,
  NgbNav,
  NgbNavChangeEvent,
  NgbNavContent,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { TeacherCardComponent } from '@shared/components/teacher-card/teacher-card.component';
import { Docente } from '@shared/models/decanatura/docente.model';
import { DocenteService } from 'app/services/decanatura/docente.service';
import { UbigeoService } from 'app/services/maestros/ubigeo.service';
import { ToastrService } from 'ngx-toastr';
import { WorkExperienceComponent } from '@shared/components/work-experience/work-experience.component';
import { ExperienciaLaboralService } from 'app/services/decanatura/experiencia-laboral.service';
import { ExperienciaProfesional } from '@shared/models/decanatura/docenteexperiencia.model';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ModalPdfViewerComponent } from '@shared/components/modal-pdf-viewer/modal-pdf-viewer.component';
import { ListEmptyComponent } from '@shared/components/list-empty/list-empty.component';

@Component({
  selector: 'app-profile-teacher',
  imports: [
    TeacherCardComponent,
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLinkBase,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet,
    WorkExperienceComponent,
    LoadingComponent,
    ListEmptyComponent
  ],
  templateUrl: './profile-teacher.component.html',
  styleUrl: './profile-teacher.component.scss',
})
export class ProfileTeacherComponent implements OnInit {
  teacher!: Docente;
  active: number = 1;

  workExperienciesList: ExperienciaProfesional[] = [];
  workExperienciesListFiltered: ExperienciaProfesional[] = [];

  controls = {
    general: { loading: false, error: false },
    work_experience: { loading: false, error: false },
  };

  teacherService = inject(DocenteService);
  ubigeoService = inject(UbigeoService);
  workExperienceService = inject(ExperienciaLaboralService);

  modalService = inject(NgbModal)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const documentNumber = params.get('documentNumber');
      if (documentNumber) {
        this.loadTeacher(documentNumber);
      } else {
        this.backToSearch();
        return;
      }
    });
  }

  loadTeacher(documentNumber: string) {
    this.controls.general.loading = true;
    this.teacherService.getDetail(documentNumber).subscribe({
      next: (response) => {
        this.teacher = response.data;
        this.ubigeoService
          .getUbigeoDetail(this.teacher.codUbigeoActual.codigoUbigeo)
          .subscribe({
            next: (response) => {
              this.teacher.codUbigeoActual = response.data;
            },
          });
        this.ubigeoService
          .getUbigeoDetail(this.teacher.codUbigeoProcedencia.codigoUbigeo)
          .subscribe({
            next: (response) => {
              this.teacher.codUbigeoProcedencia = response.data;
            },
          });

        this.controls.general.loading = false;
      },
      error: (err) => {
        this.controls.general.loading = false;
        this.controls.general.error = true;
        this.showError(
          'No se pudo cargar la información del docente. Intente nuevamente más tarde.',
        );
        this.backToSearch();
      },
    });
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    console.log('Pestaña actual:', changeEvent.activeId);
    console.log('Pestaña destino:', changeEvent.nextId);

    if (changeEvent.nextId === 2) {
      this.loadWorkExperiences();
    }

    if (changeEvent.nextId === 3) {
      // Ejemplo: prevenir el cambio si no hay permisos
      changeEvent.preventDefault();
    }
  }

  loadWorkExperiences() {
    this.controls.work_experience.loading = true;
    this.workExperienceService
      .getAllPage(0, 1000, this.teacher.numDocumento)
      .subscribe({
        next: (response) => {
          this.workExperienciesList = response.data;
          this.workExperienciesListFiltered = [...this.workExperienciesList];
          this.controls.work_experience.loading = false;
        },
        error: (err) => {
          this.controls.work_experience.loading = false;
          if ([409, 400, 404, 500].includes(err.error.status)) {
            this.showError(err.error.detail);
          } else {
            this.showError('Error desconocido. Intentelo de nuevo...');
          }
        },
      });
  }

  openPdfModal(workExperiencie: ExperienciaProfesional) {
    if (workExperiencie == undefined) {
      this.showError("No existe el documento.")
    } else {
      const modalRef = this.modalService.open(ModalPdfViewerComponent, {
        size: 'xl',
        centered: true,
        backdrop: 'static',
        scrollable: true,
      });
  
      modalRef.componentInstance.experienciaProfesionalId = workExperiencie.experienciaProfesionalId;
    }
  }

  filterSearch(event: any) {
    console.log("entra");
    
    const val = event.target.value.toLowerCase().trim();

    if (!val) {
      this.workExperienciesListFiltered = [];
      this.workExperienciesListFiltered = [...this.workExperienciesList];
      return;
    }

    // filtrar
    const filtered = this.workExperienciesList.filter((we: ExperienciaProfesional) => {
      return (
        we.empresa?.toLowerCase().includes(val) ||
        we.cargo?.toLowerCase().includes(val) ||
        we.fechaInicio?.toLowerCase().includes(val) ||
        we.fechaFin?.toLowerCase().includes(val)
      );
    });

    this.workExperienciesListFiltered = filtered;
  }

  backToSearch() {
    this.router.navigate(['/apps/search-teacher']);
  }

  showError(message: string) {
    this.toastr.error(message, 'Error!');
  }

  showInfo(message: string) {
    this.toastr.info(message, 'Información');
  }
}
