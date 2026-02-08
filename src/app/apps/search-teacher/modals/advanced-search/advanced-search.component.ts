import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocenteFilter } from '@shared/models/decanatura/docente.model';
import { DepartamentoAcademico } from '@shared/models/maestros/departamentoacademico.model';
import { Facultad } from '@shared/models/maestros/facultad.model';
import { TablaMaestra } from '@shared/models/maestros/tablamaestra.model';
import { Ubigeo } from '@shared/models/maestros/ubigeo.model';
import { DocenteService } from 'app/services/decanatura/docente.service';
import { DepartamentoacademicoService } from 'app/services/maestros/departamentoacademico.service';
import { FacultadService } from 'app/services/maestros/facultad.service';
import { TablaMaestraService } from 'app/services/maestros/tabla-maestra.service';
import { UbigeoService } from 'app/services/maestros/ubigeo.service';

@Component({
  selector: 'app-advanced-search',
  imports: [ReactiveFormsModule],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss',
})
export class AdvancedSearchComponent implements OnInit {
  @Input() data: any;

  carreras: any[] = [];
  universidades: any[] = [];
  resultadoCarrera: any[] = [];
  resultadoUniversidad: any[] = [];
  mostrarListaCarrera: boolean = false;
  mostrarListaUniversidad: boolean = false;

  documentTypeList: TablaMaestra[] = [];
  genderList: TablaMaestra[] = [];
  maritalStatusList: TablaMaestra[] = [];
  departmentsList: Ubigeo[] = [];
  provincesListNow: Ubigeo[] = [];
  districtsListNow: Ubigeo[] = [];
  provincesListProcedencia: Ubigeo[] = [];
  districtsListProcedencia: Ubigeo[] = [];

  academicGradeList: TablaMaestra[] = [];

  facultyList: Facultad[] = [];
  academicDepartmentList: DepartamentoAcademico[] = [];
  workRegimeList: TablaMaestra[] = [];
  teacherCategoryList: TablaMaestra[] = [];
  teacherLevelList: TablaMaestra[] = [];
  dedicationTimeList: TablaMaestra[] = [];

  teacherFilterForm!: FormGroup;

  controls = {
    codeDocumentType: { loading: false, error: false},
    codeGender: { loading: false, error: false},
    codeMaritalStatus: { loading: false, error: false},
    codeDepartments: { loading: false, error: false},
    codeProvincesNow: { loading: false, error: false},
    codeDistrictsNow: { loading: false, error: false},
    codeProvincesProcedencia: { loading: false, error: false},
    codeDistrictsProcedencia: { loading: false, error: false},
    
    codeAcademicGrade: { loading: false, error: false },

    codeFaculty: { loading: false, error: false },
    codeAcademicDepartment: { loading: false, error: false },
    codeWorkRegime: { loading: false, error: false },
    codeTeacherCategory: { loading: false, error: false },
    codeTeacherLevel: { loading: false, error: false },
    codeDedicationTime: { loading: false, error: false },
  };

  loadingSaveTeacher: boolean = false;

  masterTableService = inject(TablaMaestraService);
  ubigeoService = inject(UbigeoService);
  docenteService = inject(DocenteService);
  academicDepartmentService = inject(DepartamentoacademicoService);
  facultyService = inject(FacultadService);

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder, private http: HttpClient,) {}

  ngOnInit(): void {
    this.teacherFilterForm = this.fb.group({
      // --------- PERSONAL INFO ---------------
      documentType: [null],
      numDocument: [
        null,
        [
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^\d+$/),
        ],
      ],
      teacherStatus: [null],

      nameTeacher: [null],
      apellidoPaterno: [null],
      apellidoMaterno: [null],

      personalEmail: [null],
      institutionalEmail: [null],

      gender: [null],
      maritalStatus: [null],

      regionActual: [null],
      provinciaActual: [null],
      distritoActual: [null],

      regionProcedencia: [null],
      provinciaProcedencia: [null],
      distritoProcedencia: [null],

      birthdateStart: [null],
      birthdateEnd: [null],

      dateCreationStart: [null],
      dateCreationEnd: [null],

      // ----------- ACADEMIC INFO -----------------
      academicGrade: [null],
      professionalTitle: [null],
      academicInstitute: [null],
      academicSpecialty: [null],

      // ----------- CURRENT JOB INFO ---------------
      facultyId: [null],
      departmentAcademicId: [null],
      institutionalCode: [null],
      workRegimeCode: [null],
      categoryCode: [null],
      levelCode: [null],
      dedicationTime: [null],
      startDate: [null],
      endDate: [null]
    });

    this.loadDocumentType();
    this.loadGender();
    this.loadMaritalStatus();
    this.loadDepartments();

    this.loadAcademicGrade();
    this.loadProfessions();
    this.loadUniversities();

    this.loadFaculty();
    this.loadWorkRegime();
    this.loadTeacherCategory();
    this.loadTeacherLevel();
    this.loadDedicationTime();

    this.teacherFilterForm
      .get('regionActual')
      ?.valueChanges.subscribe((value) => {
        if (value != null && value !== '') {
          this.provincesListNow = [];
          this.districtsListNow = [];
          this.teacherFilterForm.get('provinciaActual')?.setValue(null);
          this.teacherFilterForm.get('distritoActual')?.setValue(null);

          this.onRegionChange(value);
        }
      });

    this.teacherFilterForm
      .get('provinciaActual')
      ?.valueChanges.subscribe((value) => {
        if (value != null && value !== '') {
          this.districtsListNow = [];
          this.teacherFilterForm.get('distritoActual')?.setValue(null);
          this.onProvinceChange(value);
        }
      });

    this.teacherFilterForm
      .get('regionProcedencia')
      ?.valueChanges.subscribe((value) => {
        if (value != null && value !== '') {
          this.provincesListProcedencia = [];
          this.districtsListProcedencia = [];
          this.teacherFilterForm.get('provinciaProcedencia')?.setValue(null);
          this.teacherFilterForm.get('distritoProcedencia')?.setValue(null);

          this.onRegionProcedenciaChange(value);
        }
      });

    this.teacherFilterForm
      .get('provinciaProcedencia')
      ?.valueChanges.subscribe((value) => {
        if (value != null && value !== '') {
          this.districtsListProcedencia = [];
          this.teacherFilterForm.get('distritoProcedencia')?.setValue(null);
          this.onProvinceProcedenciaChange(value);
        }
      });

    this.teacherFilterForm
      .get('workRegimeCode')
      ?.valueChanges.subscribe((value) => {
        if (value === this.masterTableService.DOCENTE_NOMBRADO) {
          this.teacherFilterForm.get('categoryCode')?.enable();
          this.teacherFilterForm.get('levelCode')?.disable();
          this.teacherFilterForm.get('levelCode')?.reset();
        } else if (value === this.masterTableService.DOCENTE_CONTRATADO) {
          this.teacherFilterForm.get('levelCode')?.enable();
          this.teacherFilterForm.get('categoryCode')?.disable();
          this.teacherFilterForm.get('categoryCode')?.reset();
        } else {
          // por defecto ambos bloqueados
          this.teacherFilterForm.get('levelCode')?.reset();
          this.teacherFilterForm.get('categoryCode')?.reset();
          this.teacherFilterForm.get('categoryCode')?.disable();
          this.teacherFilterForm.get('levelCode')?.disable();
        }
      });

    this.teacherFilterForm.get('facultyId')?.valueChanges.subscribe((value) => {
      this.academicDepartmentList = [];
      this.teacherFilterForm.get('departmentAcademicId')?.setValue(null);
      
      if (value !== null && value !== '') {
        this.onAcademicDepartmentChange(value);
      } else {
        this.academicDepartmentList = [];
        this.teacherFilterForm.get('departmentAcademicId')?.setValue(null);
      }
    });
  }

  onRegionChange(codigoRegion: string) {
    this.loadProvincesNow(codigoRegion);
  }

  onProvinceChange(provinceCode: string) {
    const departmentCode = this.teacherFilterForm.get('regionActual')?.value;
    if (departmentCode !== null) {
      this.loadDistrictsNow(departmentCode, provinceCode);
    }
  }

  onProvinceProcedenciaChange(provinceCode: string) {
    const departmentCode =
      this.teacherFilterForm.get('regionProcedencia')?.value;
    if (departmentCode !== null) {
      this.loadDistrictsProcedencia(departmentCode, provinceCode);
    }
  }

  onRegionProcedenciaChange(codigoRegion: string) {
    this.loadProvincesProcedencia(codigoRegion);
  }

  onAcademicDepartmentChange(facultyId: number) {
    this.loadAcademicDepartment(facultyId);
  }

  loadDocumentType() {
    this.controls.codeDocumentType.loading = true;
    this.controls.codeDocumentType.error = false;

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.TIPO_DOCUMENTO_IDENTIDAD)
      .subscribe({
        next: (response) => {
          this.documentTypeList = response.data;
          this.controls.codeDocumentType.loading = false;
        },
        error: (error) => {
          this.controls.codeDocumentType.loading = false;
          this.controls.codeDocumentType.error = true;
        },
      });
  }

  loadGender() {
    this.controls.codeGender.loading = true;
    this.controls.codeGender.error = false;

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.GENERO)
      .subscribe({
        next: (response) => {
          this.genderList = response.data;
          this.controls.codeGender.loading = false;
        },
        error: (error) => {
          this.controls.codeGender.loading = false;
          this.controls.codeGender.error = true;
        },
      });
  }

  loadMaritalStatus() {
    this.controls.codeMaritalStatus.loading = true;
    this.controls.codeMaritalStatus.error = false;

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.ESTADO_CIVIL)
      .subscribe({
        next: (response) => {
          this.maritalStatusList = response.data;
          this.controls.codeMaritalStatus.loading = false;
        },
        error: (error) => {
          this.controls.codeMaritalStatus.loading = false;
          this.controls.codeMaritalStatus.error = true;
        },
      });
  }

  loadDepartments() {
    this.controls.codeDepartments.loading = true;
    this.controls.codeDepartments.error = false;

    this.ubigeoService.getDepartments().subscribe({
      next: (response) => {
        this.departmentsList = response.data;
        this.controls.codeDepartments.loading = false;
      },
      error: (error) => {
        this.controls.codeDepartments.loading = false;
        this.controls.codeDepartments.error = true;
      },
    });
  }

  loadProvincesNow(departmentCode: string) {
    this.controls.codeProvincesNow.loading = true;
    this.controls.codeProvincesNow.error = false;

    this.ubigeoService.getProvinces(departmentCode).subscribe({
      next: (response) => {
        this.provincesListNow = response.data;
        this.controls.codeProvincesNow.loading = false;
      },
      error: (error) => {
        this.controls.codeProvincesNow.loading = false;
        this.controls.codeProvincesNow.error = true;
      },
    });
  }

  loadDistrictsNow(departmentCode: string, provinceCode: string) {
    this.controls.codeDistrictsNow.loading = true;
    this.controls.codeDistrictsNow.error = false;

    this.ubigeoService.getDistricts(departmentCode, provinceCode).subscribe({
      next: (response) => {
        this.districtsListNow = response.data;
        this.controls.codeDistrictsNow.loading = false;
      },
      error: (error) => {
        this.controls.codeDistrictsNow.loading = false;
        this.controls.codeDistrictsNow.error = true;
      },
    });
  }

  loadProvincesProcedencia(departmentCode: string) {
    this.controls.codeProvincesProcedencia.loading = true;
    this.controls.codeProvincesProcedencia.error = false;

    this.ubigeoService.getProvinces(departmentCode).subscribe({
      next: (response) => {
        this.provincesListProcedencia = response.data;
        this.controls.codeProvincesProcedencia.loading = false;
      },
      error: (error) => {
        this.controls.codeProvincesProcedencia.loading = false;
        this.controls.codeProvincesProcedencia.error = true;
      },
    });
  }

  loadDistrictsProcedencia(departmentCode: string, provinceCode: string) {
    this.controls.codeDistrictsProcedencia.loading = true;
    this.controls.codeDistrictsProcedencia.error = false;

    this.ubigeoService.getDistricts(departmentCode, provinceCode).subscribe({
      next: (response) => {
        this.districtsListProcedencia = response.data;
        this.controls.codeDistrictsProcedencia.loading = false;
      },
      error: (error) => {
        this.controls.codeDistrictsProcedencia.loading = false;
        this.controls.codeDistrictsProcedencia.error = true;
      },
    });
  }

  loadAcademicGrade() {
    this.controls.codeAcademicGrade.loading = true;
    this.controls.codeAcademicGrade.error = false;

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.GRADO_ACADEMICO)
      .subscribe({
        next: (response) => {
          this.academicGradeList = response.data;
          this.controls.codeAcademicGrade.loading = false;
        },
        error: (error) => {
          this.controls.codeAcademicGrade.loading = false;
          this.controls.codeAcademicGrade.error = true;
        },
      });
  }

  loadProfessions() {
    this.http
      .get<any[]>('assets/data/professions-data.json')
      .subscribe((data) => {
        this.carreras = data;
      });
  }

  loadUniversities() {
    this.http.get<any[]>('assets/data/universidades.json').subscribe((data) => {
      this.universidades = data;
    });
  }

  loadFaculty() {
    this.controls.codeFaculty.loading = true;
    this.controls.codeFaculty.error = false;
    
    this.facultyService.getList().subscribe({
      next: (response) => {
        this.facultyList = response.data;
        this.controls.codeFaculty.loading = false;
      },
      error: (error) => {
        this.controls.codeFaculty.loading = false;
        this.controls.codeFaculty.error = true;
      },
    });
  }

  loadAcademicDepartment(facultyId: number) {
    this.controls.codeAcademicDepartment.loading = true;
    this.controls.codeAcademicDepartment.error = false;
    
    this.academicDepartmentService.getByFaculty(facultyId).subscribe({
      next: (response) => {
        this.academicDepartmentList = response.data;
        
        this.controls.codeAcademicDepartment.loading = false;
      },
      error: (error) => {
        this.controls.codeAcademicDepartment.loading = false;
        this.controls.codeAcademicDepartment.error = true;
      },
    });
  }

  loadWorkRegime() {
    this.controls.codeWorkRegime.loading = true;
    this.controls.codeWorkRegime.error = false;
    
    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.REGIMEN_LABORAL)
      .subscribe({
        next: (response) => {
          this.workRegimeList = response.data;
          this.controls.codeWorkRegime.loading = false;
        },
        error: (error) => {
          this.controls.codeWorkRegime.loading = false;
          this.controls.codeWorkRegime.error = true;
        },
      });
  }

  loadTeacherCategory() {
    this.controls.codeTeacherCategory.loading = true;
    this.controls.codeTeacherCategory.error = false;
    
    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.CATEGORIA_DOCENTE)
      .subscribe({
        next: (response) => {
          this.teacherCategoryList = response.data;
          this.controls.codeTeacherCategory.loading = false;
        },
        error: (error) => {
          this.controls.codeTeacherCategory.loading = false;
          this.controls.codeTeacherCategory.error = true;
        },
      });
  }

  loadTeacherLevel() {
    this.controls.codeTeacherLevel.loading = true;
    this.controls.codeTeacherLevel.error = false;
    
    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.NIVEL_DOCENTE)
      .subscribe({
        next: (response) => {
          this.teacherLevelList = response.data;
          this.controls.codeTeacherLevel.loading = false;
        },
        error: (error) => {
          this.controls.codeTeacherLevel.loading = false;
          this.controls.codeTeacherLevel.error = true;
        },
      });
  }

  loadDedicationTime() {
    this.controls.codeDedicationTime.loading = true;
    this.controls.codeDedicationTime.error = false;
    
    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.TIEMPO_DEDICACION)
      .subscribe({
        next: (response) => {
          this.dedicationTimeList = response.data;
          this.controls.codeDedicationTime.loading = false;
        },
        error: (error) => {
          this.controls.codeDedicationTime.loading = false;
          this.controls.codeDedicationTime.error = true;
        },
      });
  }

  search() {
    console.log(this.fromTeacherFilterFormToTeacherFilter());
    this.activeModal.close(this.fromTeacherFilterFormToTeacherFilter());

    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

  close() {
    this.activeModal.dismiss();
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

  retryDocumentTypes() {
    this.loadDocumentType();
  }

  retryGender() {
    this.loadGender();
  }

  retryMaritalStatus() {
    this.loadMaritalStatus();
  }

  retryDepartments() {
    this.loadDepartments();
  }

  retryProvincesNow() {
    const departmentCode = this.teacherFilterForm.get('regionActual')?.value;
    if (departmentCode !== null) {
      this.loadProvincesNow(departmentCode);
    }
  }

  retryDistrictsNow() {
    const departmentCode = this.teacherFilterForm.get('regionActual')?.value;
    const provinceCode = this.teacherFilterForm.get('provinciaActual')?.value;
    if (departmentCode !== null && provinceCode !== null) {
      this.loadDistrictsNow(departmentCode, provinceCode);
    }
  }

  retryProvincesProcedencia() {
    const departmentCode =
      this.teacherFilterForm.get('regionProcedencia')?.value;
    if (departmentCode !== null) {
      this.loadProvincesProcedencia(departmentCode);
    }
  }

  retryDistrictsProcedencia() {
    const departmentCode =
      this.teacherFilterForm.get('regionProcedencia')?.value;
    const provinceCode = this.teacherFilterForm.get(
      'provinciaProcedencia'
    )?.value;
    if (departmentCode !== null && provinceCode !== null) {
      this.loadDistrictsProcedencia(departmentCode, provinceCode);
    }
  }

  retryAcademicGrade() {
    this.loadAcademicGrade();
  }

  retryFaculty() {
    this.loadFaculty();
  }

  retryAcademicDepartment() {
    const facultyId = this.teacherFilterForm.get('facultyId')?.value;
    if (facultyId !== null) {
      this.loadAcademicDepartment(facultyId);
    } else {
      this.academicDepartmentList = [];
      this.teacherFilterForm.get('departmentAcademicId')?.setValue(null);
    }
  }

  retryWorkRegime() {
    this.loadWorkRegime();
  }

  retryTeacherCategory() {
    this.loadTeacherCategory();
  }

  retryTeacherLevel() {
    this.loadTeacherLevel();
  }

  retryDedicationTime() {
    this.loadDedicationTime();
  }

  reset() {
    //this.resetVariables()
    this.teacherFilterForm.reset();
    //this.desactiveForm();
    //this.teacherFilterForm.get('documentType')?.setValue('001001');
  }

  isInvalid(controlName: string): boolean {
    const control = this.teacherFilterForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  onlyNumbers(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  allowNumbersAndPlus(event: KeyboardEvent): void {
    const char = event.key;

    if (char >= '0' && char <= '9') {
      return;
    }

    // Permitir +
    if (char === '+') {
      const input = event.target as HTMLInputElement;

      // Solo permitir + si es el primer carácter
      if (input.selectionStart === 0 && !input.value.includes('+')) {
        return;
      }
    }

    // Bloquear todo lo demás
    event.preventDefault();
  }

  fromTeacherFilterFormToTeacherFilter(): DocenteFilter | null {
    const form = this.teacherFilterForm.getRawValue();

    const result: Partial<DocenteFilter> = {};

    const map: Record<string, keyof DocenteFilter> = {
      documentType: 'typeDocument',
      numDocument: 'documentNumber',
      nameTeacher: 'name',
      apellidoPaterno: 'lastName1',
      apellidoMaterno: 'lastName2',
      birthdateStart: 'birthdateStart',
      birthdateEnd: 'birthdateEnd',
      personalEmail: 'personalEmail',
      institutionalEmail: 'institutionalEmail',
      gender: 'gender',
      maritalStatus: 'maritalStatus',
      teacherStatus: 'status',
      dateCreationStart: 'dateCreationStart',
      dateCreationEnd: 'dateCreationEnd',

      academicGrade: 'academicGrade',
      professionalTitle: 'professionalTitle',
      academicInstitute: 'academicInstitute',
      academicSpecialty: 'academicSpecialty',

      departmentAcademicId: 'departmentAcademicId',
      institutionalCode: 'institutionalCode',
      workRegimeCode: 'workRegimeCode',
      categoryCode: 'categoryCode',
      levelCode: 'levelCode',
      dedicationTime: 'dedicationTime'

    };

    // 🔹 Campos simples
    for (const [formKey, apiKey] of Object.entries(map)) {
      const value = this.normalizeValue(form[formKey]);
      if (value !== null) {
        result[apiKey] = value;
      }
    }

    // 🔹 Ubigeo actual
    const actual = this.resolveUbigeo(
      form.regionActual,
      form.provinciaActual,
      form.distritoActual
    );

    if (actual.ubigeo) {
      result.ubigeoActual = actual.ubigeo;
      result.nivelActual = actual.level!;
    }

    // 🔹 Ubigeo procedencia
    const origin = this.resolveUbigeo(
      form.regionProcedencia,
      form.provinciaProcedencia,
      form.distritoProcedencia
    );

    if (origin.ubigeo) {
      result.ubigeoProcedencia = origin.ubigeo;
      result.nivelProcedencia = origin.level!;
    }

    // 🔹 Si no hay filtros → null
    return Object.keys(result).length ? (result as DocenteFilter) : null;
  }

  private normalizeValue(value: any): any {
    if (value === null || value === undefined) return null;

    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' || trimmed === 'null' ? null : trimmed;
    }

    return value;
  }

  private resolveUbigeo(
    region: any,
    provincia: any,
    distrito: any
  ): { ubigeo?: string; level?: number } {
    if (distrito) return { ubigeo: distrito, level: 3 };
    if (provincia) return { ubigeo: `${region}${provincia}00`, level: 2 };
    if (region) return { ubigeo: `${region}0000`, level: 1 };
    return {};
  }

  onInputProfession() {
    const valor = this.teacherFilterForm.get('professionalTitle')?.value || '';

    if (!valor.trim()) {
      this.resultadoCarrera = [];
      return;
    }

    this.resultadoCarrera = this.carreras
      .filter((c) => c.nombre.toLowerCase().includes(valor.toLowerCase()))
      .slice(0, 5);

    this.mostrarListaCarrera = true;
  }

  cerrarListaProfession() {
    setTimeout(() => (this.mostrarListaCarrera = false), 150);
  }

  seleccionarProfession(profession: any) {
    this.teacherFilterForm.get('professionalTitle')?.setValue(profession.nombre);
    this.mostrarListaCarrera = false;
    this.resultadoCarrera = [];
  }

  onInputUniversity() {
    const valor = this.teacherFilterForm.get('academicInstitute')?.value || '';

    if (!valor.trim()) {
      this.resultadoUniversidad = [];
      return;
    }

    this.resultadoUniversidad = this.universidades
      .filter(
        (u) =>
          u.nombre.toLowerCase().includes(valor.toLowerCase()) ||
          u.sigla.toLowerCase().includes(valor.toLowerCase()),
      )
      .slice(0, 5);

    this.mostrarListaUniversidad = true;
  }

  cerrarListaUniversity() {
    setTimeout(() => (this.mostrarListaUniversidad = false), 150);
  }

  seleccionarUniversity(university: any) {
    this.teacherFilterForm.get('academicInstitute')?.setValue(university.nombre);
    this.mostrarListaUniversidad = false;
    this.resultadoUniversidad = [];
  }

}
