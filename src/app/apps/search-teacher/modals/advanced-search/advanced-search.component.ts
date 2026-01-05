import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocenteFilter } from '@shared/models/decanatura/docente.model';
import { TablaMaestra } from '@shared/models/maestros/tablamaestra.model';
import { Ubigeo } from '@shared/models/maestros/ubigeo.model';
import { DocenteService } from 'app/services/decanatura/docente.service';
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

  documentTypeList: TablaMaestra[] = [];
  genderList: TablaMaestra[] = [];
  maritalStatusList: TablaMaestra[] = [];
  departmentsList: Ubigeo[] = [];
  provincesListNow: Ubigeo[] = [];
  districtsListNow: Ubigeo[] = [];
  provincesListProcedencia: Ubigeo[] = [];
  districtsListProcedencia: Ubigeo[] = [];

  teacherFilterForm!: FormGroup;

  loadingDocumentType: boolean = false;
  loadingGender: boolean = false;
  loadingMaritalStatus: boolean = false;
  loadingDepartments: boolean = false;
  loadingProvincesNow: boolean = false;
  loadingDistrictsNow: boolean = false;
  loadingProvincesProcedencia: boolean = false;
  loadingDistrictsProcedencia: boolean = false;

  loadingSearchTeacher: boolean = false;
  loadingSaveTeacher: boolean = false;

  errorDocumentType: boolean = false;
  errorGender: boolean = false;
  errorMaritalStatus: boolean = false;
  errorDepartments: boolean = false;
  errorProvincesNow: boolean = false;
  errorDistrictsNow: boolean = false;
  errorProvincesProcedencia: boolean = false;
  errorDistrictsProcedencia: boolean = false;

  masterTableService = inject(TablaMaestraService);
  ubigeoService = inject(UbigeoService);
  docenteService = inject(DocenteService);

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.teacherFilterForm = this.fb.group({
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
    });

    this.loadDocumentType();
    this.loadGender();
    this.loadMaritalStatus();
    this.loadDepartments();

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

  loadDocumentType() {
    this.loadingDocumentType = true;
    this.errorDocumentType = false;

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.TIPO_DOCUMENTO_IDENTIDAD)
      .subscribe({
        next: (response) => {
          this.documentTypeList = response.data;
          this.loadingDocumentType = false;
        },
        error: (error) => {
          this.loadingDocumentType = false;
          this.errorDocumentType = true;
        },
      });
  }

  loadGender() {
    this.loadingGender = true;
    this.errorGender = false;

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.GENERO)
      .subscribe({
        next: (response) => {
          this.genderList = response.data;
          this.loadingGender = false;
        },
        error: (error) => {
          this.loadingGender = false;
          this.errorGender = true;
        },
      });
  }

  loadMaritalStatus() {
    this.loadingMaritalStatus = true;
    this.errorMaritalStatus = false;

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.ESTADO_CIVIL)
      .subscribe({
        next: (response) => {
          this.maritalStatusList = response.data;
          this.loadingMaritalStatus = false;
        },
        error: (error) => {
          this.loadingMaritalStatus = false;
          this.errorMaritalStatus = true;
        },
      });
  }

  loadDepartments() {
    this.loadingDepartments = true;
    this.errorDepartments = false;

    this.ubigeoService.getDepartments().subscribe({
      next: (response) => {
        this.departmentsList = response.data;
        this.loadingDepartments = false;
      },
      error: (error) => {
        this.loadingDepartments = false;
        this.errorDepartments = true;
      },
    });
  }

  loadProvincesNow(departmentCode: string) {
    this.loadingProvincesNow = true;
    this.errorProvincesNow = false;

    this.ubigeoService.getProvinces(departmentCode).subscribe({
      next: (response) => {
        this.provincesListNow = response.data;
        this.loadingProvincesNow = false;
      },
      error: (error) => {
        this.loadingProvincesNow = false;
        this.errorProvincesNow = true;
      },
    });
  }

  loadDistrictsNow(departmentCode: string, provinceCode: string) {
    this.loadingDistrictsNow = true;
    this.errorDistrictsNow = false;

    this.ubigeoService.getDistricts(departmentCode, provinceCode).subscribe({
      next: (response) => {
        this.districtsListNow = response.data;
        this.loadingDistrictsNow = false;
      },
      error: (error) => {
        this.loadingDistrictsNow = false;
        this.errorDistrictsNow = true;
      },
    });
  }

  loadProvincesProcedencia(departmentCode: string) {
    this.loadingProvincesProcedencia = true;
    this.errorProvincesProcedencia = false;

    this.ubigeoService.getProvinces(departmentCode).subscribe({
      next: (response) => {
        this.provincesListProcedencia = response.data;
        this.loadingProvincesProcedencia = false;
      },
      error: (error) => {
        this.loadingProvincesProcedencia = false;
        this.errorProvincesProcedencia = true;
      },
    });
  }

  loadDistrictsProcedencia(departmentCode: string, provinceCode: string) {
    this.loadingDistrictsProcedencia = true;
    this.errorDistrictsProcedencia = false;

    this.ubigeoService.getDistricts(departmentCode, provinceCode).subscribe({
      next: (response) => {
        this.districtsListProcedencia = response.data;
        this.loadingDistrictsProcedencia = false;
      },
      error: (error) => {
        this.loadingDistrictsProcedencia = false;
        this.errorDistrictsProcedencia = true;
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
    //this.loadDocumentType();
  }

  retryGender() {
    //this.loadGender();
  }

  retryMaritalStatus() {
    //this.loadMaritalStatus();
  }

  retryDepartments() {
    //this.loadDepartments();
  }

  retryProvincesNow() {
    const departmentCode = this.teacherFilterForm.get('regionActual')?.value;
    if (departmentCode !== null) {
      //this.loadProvincesNow(departmentCode);
    }
  }

  retryDistrictsNow() {
    const departmentCode = this.teacherFilterForm.get('regionActual')?.value;
    const provinceCode = this.teacherFilterForm.get('provinciaActual')?.value;
    if (departmentCode !== null && provinceCode !== null) {
      //this.loadDistrictsNow(departmentCode, provinceCode);
    }
  }

  retryProvincesProcedencia() {
    const departmentCode =
      this.teacherFilterForm.get('regionProcedencia')?.value;
    if (departmentCode !== null) {
      //this.loadProvincesProcedencia(departmentCode);
    }
  }

  retryDistrictsProcedencia() {
    const departmentCode =
      this.teacherFilterForm.get('regionProcedencia')?.value;
    const provinceCode = this.teacherFilterForm.get(
      'provinciaProcedencia'
    )?.value;
    if (departmentCode !== null && provinceCode !== null) {
      //this.loadDistrictsProcedencia(departmentCode, provinceCode);
    }
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
}
