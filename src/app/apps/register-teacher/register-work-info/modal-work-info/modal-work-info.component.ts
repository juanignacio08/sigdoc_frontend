import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Docente } from '@shared/models/decanatura/docente.model';
import { DocenteLaboral, DocenteLaboralRequest } from '@shared/models/decanatura/docentelaboral.model';
import { DepartamentoAcademico } from '@shared/models/maestros/departamentoacademico.model';
import { Facultad } from '@shared/models/maestros/facultad.model';
import { TablaMaestra } from '@shared/models/maestros/tablamaestra.model';
import { DepartamentoacademicoService } from 'app/services/maestros/departamentoacademico.service';
import { FacultadService } from 'app/services/maestros/facultad.service';
import { TablaMaestraService } from 'app/services/maestros/tabla-maestra.service';

@Component({
  selector: 'app-modal-work-info',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-work-info.component.html',
  styleUrl: './modal-work-info.component.scss',
})
export class ModalWorkInfoComponent implements OnInit {
  @Input() teacherWork?: DocenteLaboral;
  @Input() teacherActive?: Docente;
  @Input() action: string = 'add';
  @Input() title: string = 'Registrar Información Laboral';

  workInfoForm!: FormGroup;

  facultyList: Facultad[] = [];
  academicDepartmentList: DepartamentoAcademico[] = [];
  workRegimeList: TablaMaestra[] = [];
  teacherCategoryList: TablaMaestra[] = [];
  teacherLevelList: TablaMaestra[] = [];
  dedicationTimeList: TablaMaestra[] = [];

  controls = {
    faculty: { loading: false, error: false },
    academicDepartment: { loading: false, error: false },
    workRegime: { loading: false, error: false },
    teacherCategory: { loading: false, error: false },
    teacherLevel: { loading: false, error: false },
    dedicationTime: { loading: false, error: false },
  };

  masterTableService = inject(TablaMaestraService);
  academicDepartmentService = inject(DepartamentoacademicoService);
  facultyService = inject(FacultadService);

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.loadFaculty();
    this.loadTeacherCategory();
    this.loadWorkRegime();
    this.loadTeacherCategory();
    this.loadTeacherLevel();
    this.loadDedicationTime();

    this.workInfoForm
      .get('codRegimenLaboral')
      ?.valueChanges.subscribe((value) => {
        if (value === this.masterTableService.DOCENTE_NOMBRADO) {
          this.workInfoForm.get('codCategoriaDocenteNombrado')?.enable();
          this.workInfoForm.get('codNivelDocenteContratado')?.disable();
          this.workInfoForm.get('codNivelDocenteContratado')?.reset();
        } else if (value === this.masterTableService.DOCENTE_CONTRATADO) {
          this.workInfoForm.get('codNivelDocenteContratado')?.enable();
          this.workInfoForm.get('codCategoriaDocenteNombrado')?.disable();
          this.workInfoForm.get('codCategoriaDocenteNombrado')?.reset();
        } else {
          // por defecto ambos bloqueados
          this.workInfoForm.get('codCategoriaDocenteNombrado')?.disable();
          this.workInfoForm.get('codNivelDocenteContratado')?.disable();
        }
      });

    this.workInfoForm.get('facultadId')?.valueChanges.subscribe((value) => {
      this.academicDepartmentList = [];
      this.workInfoForm.get('departamentoId')?.setValue(null);
      if (value != null && value !== '') {
        this.onAcademicDepartmentChange(value);
      }
    });

    if (this.action === 'edit' && this.teacherWork) {
      this.setForm();
    }
  }

  private initForm() {
    this.workInfoForm = this.fb.group({
      facultadId: [null, Validators.required],
      departamentoId: [null, Validators.required],
      codigoInstitucional: ['', Validators.required],
      emailInstitucional: [this.teacherActive?.emailInstitucional, Validators.email],
      codRegimenLaboral: [null, Validators.required],

      codCategoriaDocenteNombrado: [{ value: null, disabled: true }],
      codNivelDocenteContratado: [{ value: null, disabled: true }],

      codTiempoDedicacion: [null],
      fechaInicio: [null],
      fechaFin: [null],
      documento: [null],
      estado: [1]
    });
  }

  private setForm() {
    console.log(this.teacherWork);
    
    this.workInfoForm.get('facultadId')?.setValue(this.teacherWork?.departamentoAcademico.facultad.facultadId);
    this.workInfoForm.get('codigoInstitucional')?.setValue(this.teacherWork?.codigoInstitucional);
    this.workInfoForm.get('emailInstitucional')?.setValue(this.teacherWork?.emailInstitucional);
    this.workInfoForm.get('codRegimenLaboral')?.setValue(this.teacherWork?.codRegimenLaboral.codigo);
    if (this.teacherWork?.codCategoriaDocenteNombrado) {
      this.workInfoForm.get('codCategoriaDocenteNombrado')?.setValue(this.teacherWork?.codCategoriaDocenteNombrado.codigo);
    }
    if (this.teacherWork?.codNivelDocenteContratado) {
      this.workInfoForm.get('codNivelDocenteContratado')?.setValue(this.teacherWork?.codNivelDocenteContratado.codigo);
    }
    if (this.teacherWork?.codTiempoDedicacion) {
      this.workInfoForm.get('codTiempoDedicacion')?.setValue(this.teacherWork?.codTiempoDedicacion.codigo);
    }

    if (this.teacherWork?.fechaInicio) {
      this.workInfoForm.get('fechaInicio')?.setValue(this.formatDateToISO(this.teacherWork?.fechaInicio));
    }
    if (this.teacherWork?.fechaFin) {
      this.workInfoForm.get('fechaFin')?.setValue(this.formatDateToISO(this.teacherWork?.fechaFin));
    }

    if (this.teacherWork?.documento) {
      this.workInfoForm.get('documento')?.setValue(this.teacherWork?.documento.denominacion);
    }

    this.workInfoForm.get('estado')?.setValue(this.teacherWork?.estado);
    
  }

  onAcademicDepartmentChange(facultyId: number) {
    this.loadAcademicDepartment(facultyId);
  }

  loadFaculty() {
    this.controls.faculty.loading = true;
    this.controls.faculty.error = false;
    this.workInfoForm.get('facultadId')?.disable();

    this.facultyService.getList().subscribe({
      next: (response) => {
        this.facultyList = response.data;
        this.controls.faculty.loading = false;
        this.workInfoForm.get('facultadId')?.enable();
      },
      error: (error) => {
        this.controls.faculty.loading = false;
        this.controls.faculty.error = true;
      },
    });
  }

  retryFaculty() {
    this.loadFaculty();
  }

  loadAcademicDepartment(facultyId: number) {
    console.log("ejecutando");
    
    this.controls.academicDepartment.loading = true;
    this.controls.academicDepartment.error = false;
    this.workInfoForm.get('departamentoId')?.disable();

    this.academicDepartmentService.getByFaculty(facultyId).subscribe({
      next: (response) => {
        this.academicDepartmentList = response.data;
        console.log(this.academicDepartmentList);
        
        this.controls.academicDepartment.loading = false;
        if (this.teacherWork) {
          this.workInfoForm.get('departamentoId')?.setValue(this.teacherWork.departamentoAcademico.departamentoAcademicoId);
        }
        this.workInfoForm.get('departamentoId')?.enable();
      },
      error: (error) => {
        this.controls.academicDepartment.loading = false;
        this.controls.academicDepartment.error = true;
      },
    });
  }

  retryAcademicDepartment() {
    const facultyId = this.workInfoForm.get('facultadId')?.value;
    if (facultyId !== null) {
      this.loadAcademicDepartment(facultyId);
    }
  }

  loadWorkRegime() {
    this.controls.workRegime.loading = true;
    this.controls.workRegime.error = false;
    this.workInfoForm.get('codRegimenLaboral')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.REGIMEN_LABORAL)
      .subscribe({
        next: (response) => {
          this.workRegimeList = response.data;
          this.controls.workRegime.loading = false;
          this.workInfoForm.get('codRegimenLaboral')?.enable();
        },
        error: (error) => {
          this.controls.workRegime.loading = false;
          this.controls.workRegime.error = true;
        },
      });
  }

  retryWorkRegime() {
    this.loadWorkRegime();
  }

  loadTeacherCategory() {
    this.controls.teacherCategory.loading = true;
    this.controls.teacherCategory.error = false;
    this.workInfoForm.get('codCategoriaDocenteNombrado')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.CATEGORIA_DOCENTE)
      .subscribe({
        next: (response) => {
          this.teacherCategoryList = response.data;
          this.controls.teacherCategory.loading = false;
        },
        error: (error) => {
          this.controls.teacherCategory.loading = false;
          this.controls.teacherCategory.error = true;
        },
      });
  }

  retryTeacherCategory() {
    this.loadTeacherCategory();
  }

  loadTeacherLevel() {
    this.controls.teacherLevel.loading = true;
    this.controls.teacherLevel.error = false;
    this.workInfoForm.get('codNivelDocenteContratado')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.NIVEL_DOCENTE)
      .subscribe({
        next: (response) => {
          this.teacherLevelList = response.data;
          this.controls.teacherLevel.loading = false;
        },
        error: (error) => {
          this.controls.teacherLevel.loading = false;
          this.controls.teacherLevel.error = true;
        },
      });
  }

  retryTeacherLevel() {
    this.loadTeacherLevel();
  }

  loadDedicationTime() {
    this.controls.dedicationTime.loading = true;
    this.controls.dedicationTime.error = false;
    this.workInfoForm.get('codTiempoDedicacion')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.TIEMPO_DEDICACION)
      .subscribe({
        next: (response) => {
          this.dedicationTimeList = response.data;
          this.controls.dedicationTime.loading = false;
          this.workInfoForm.get('codTiempoDedicacion')?.enable();
        },
        error: (error) => {
          this.controls.dedicationTime.loading = false;
          this.controls.dedicationTime.error = true;
        },
      });
  }

  retryDedicationTime() {
    this.loadDedicationTime();
  }

  submit() {
    if (this.workInfoForm.valid && this.teacherActive) {
      this.activeModal.close(this.fromFormToTeacherWork());

      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      });
    } else {
      console.log('no entro');
      
    }
  }

  close() {
    this.activeModal.dismiss();
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

  isInvalid(controlPath: string): boolean {
    const control = this.workInfoForm.get(controlPath);
    return !!(control && control.invalid && control.touched);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.workInfoForm.patchValue({
        documento: file,
      });
    }
  }

  fromFormToTeacherWork(): DocenteLaboralRequest {
    const workTeacher: DocenteLaboralRequest = {
      docenteLaboralId: this.teacherWork?.docenteLaboralId || 1,
      docenteId: this.teacherActive?.docenteId || 0,
      departamentoId: this.workInfoForm.get('departamentoId')?.value,
      codigoInstitucional: this.emptyToUndefined(this.workInfoForm.get('codigoInstitucional')?.value),
      emailInstitucional: this.emptyToUndefined(this.workInfoForm.get('emailInstitucional')?.value),
      codRegimenLaboral: this.workInfoForm.get('codRegimenLaboral')?.value,
      codCategoriaDocenteNombrado: this.emptyToUndefined(this.workInfoForm.get('codCategoriaDocenteNombrado')?.value),
      codNivelDocenteContratado: this.emptyToUndefined(this.workInfoForm.get('codNivelDocenteContratado')?.value),
      codTiempoDedicacion: this.emptyToUndefined(this.workInfoForm.get('codTiempoDedicacion')?.value),
      fechaInicio: this.emptyToUndefined(this.getDate('fechaInicio')),
      fechaFin: this.emptyToUndefined(this.getDate('fechaFin')),
      estado: 1,
    };

    return this.removeUndefined(workTeacher);
  }

  private emptyToUndefined(value: any): any {
    if (value === null || value === undefined) return undefined;

    if (typeof value === 'string') {
      return value.trim() === '' ? undefined : value.trim();
    }

    return value;
  }

  private removeUndefined<T extends object>(obj: T): T {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined),
    ) as T;
  }

  private getDate(controlName: string): string | undefined {
    const fecha = this.workInfoForm.get(controlName)?.value;

    if (fecha) {
      const [anio, mes, dia] = fecha.split('-');
      const fechaFormateada = `${dia}/${mes}/${anio}`;
      return fechaFormateada;
    } else {
      return undefined;
    }
  }

  private formatDateToISO(fecha: string): string {
    if (fecha !== null && fecha !== undefined) {
      const [dia, mes, anio] = fecha.split('/');
      return `${anio}-${mes}-${dia}`;
    }
    return '';
  }
}
