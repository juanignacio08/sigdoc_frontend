import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { StepperComponent } from '@shared/components/stepper/stepper.component';
import {
  Docente,
  DocenteRequest,
} from '@shared/models/decanatura/docente.model';
import { TablaMaestra } from '@shared/models/maestros/tablamaestra.model';
import { Ubigeo } from '@shared/models/maestros/ubigeo.model';
import { DocenteService } from 'app/services/decanatura/docente.service';
import { TablaMaestraService } from 'app/services/maestros/tabla-maestra.service';
import { UbigeoService } from 'app/services/maestros/ubigeo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-teacher',
  imports: [StepperComponent, NgbTooltip, ReactiveFormsModule],
  templateUrl: './register-teacher.component.html',
  styleUrl: './register-teacher.component.scss',
})
export class RegisterTeacherComponent implements OnInit {
  currentStep = 0;

  documentTypeList: TablaMaestra[] = [];
  genderList: TablaMaestra[] = [];
  maritalStatusList: TablaMaestra[] = [];
  departmentsList: Ubigeo[] = [];
  provincesListNow: Ubigeo[] = [];
  districtsListNow: Ubigeo[] = [];
  provincesListProcedencia: Ubigeo[] = [];
  districtsListProcedencia: Ubigeo[] = [];

  teacherActive ?: Docente; 

  teacherForm!: FormGroup;

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

  errorSearchTeacher: boolean = false;
  errorSaveTeacher: boolean = false;

  ubigeoActual?: string;
  ubigeoProcedencia?: string;

  masterTableService = inject(TablaMaestraService);
  ubigeoService = inject(UbigeoService);
  docenteService = inject(DocenteService);

  constructor(private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.setFormTeacher(null);

    this.loadDocumentType();
    this.loadGender();
    this.loadMaritalStatus();
    this.loadDepartments();

    this.teacherForm.get('regionActual')?.valueChanges.subscribe((value) => {
      if (value != null && value !== '') {
        this.provincesListNow = [];
        this.districtsListNow = [];
        this.teacherForm.get('provinciaActual')?.setValue(null);
        this.teacherForm.get('distritoActual')?.setValue(null);

        this.onRegionChange(value);
      }
    });

    this.teacherForm.get('provinciaActual')?.valueChanges.subscribe((value) => {
      if (value != null && value !== '') {
        this.districtsListNow = [];
        this.teacherForm.get('distritoActual')?.setValue(null);
        this.onProvinceChange(value);
      }
    });

    this.teacherForm
      .get('regionProcedencia')
      ?.valueChanges.subscribe((value) => {
        if (value != null && value !== '') {
          this.provincesListProcedencia = [];
          this.districtsListProcedencia = [];
          this.teacherForm.get('provinciaProcedencia')?.setValue(null);
          this.teacherForm.get('distritoProcedencia')?.setValue(null);

          this.onRegionProcedenciaChange(value);
        }
      });

    this.teacherForm
      .get('provinciaProcedencia')
      ?.valueChanges.subscribe((value) => {
        if (value != null && value !== '') {
          this.districtsListProcedencia = [];
          this.teacherForm.get('distritoProcedencia')?.setValue(null);
          this.onProvinceProcedenciaChange(value);
        }
      });
  }

  onProvinceProcedenciaChange(provinceCode: string) {
    const departmentCode = this.teacherForm.get('regionProcedencia')?.value;
    if (departmentCode !== null) {
      this.loadDistrictsProcedencia(departmentCode, provinceCode);
    }
  }

  onRegionProcedenciaChange(codigoRegion: string) {
    this.loadProvincesProcedencia(codigoRegion);
  }

  onProvinceChange(provinceCode: string) {
    const departmentCode = this.teacherForm.get('regionActual')?.value;
    if (departmentCode !== null) {
      this.loadDistrictsNow(departmentCode, provinceCode);
    }
  }

  onRegionChange(codigoRegion: string) {
    this.loadProvincesNow(codigoRegion);
  }

  loadDocumentType() {
    this.loadingDocumentType = true;
    this.errorDocumentType = false;
    this.teacherForm.get('documentType')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.TIPO_DOCUMENTO_IDENTIDAD)
      .subscribe({
        next: (response) => {
          this.documentTypeList = response.data;
          this.loadingDocumentType = false;
          this.teacherForm.get('documentType')?.enable();
        },
        error: (error) => {
          this.loadingDocumentType = false;
          this.errorDocumentType = true;
        },
      });
  }

  retryDocumentTypes() {
    this.loadDocumentType();
  }

  loadGender() {
    this.loadingGender = true;
    this.errorGender = false;
    this.teacherForm.get('gender')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.GENERO)
      .subscribe({
        next: (response) => {
          this.genderList = response.data;
          this.loadingGender = false;
          //this.teacherForm.get('gender')?.enable();
        },
        error: (error) => {
          this.loadingGender = false;
          this.errorGender = true;
        },
      });
  }

  retryGender() {
    this.loadGender();
  }

  loadMaritalStatus() {
    this.loadingMaritalStatus = true;
    this.errorMaritalStatus = false;
    this.teacherForm.get('maritalStatus')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.ESTADO_CIVIL)
      .subscribe({
        next: (response) => {
          this.maritalStatusList = response.data;
          this.loadingMaritalStatus = false;
          //this.teacherForm.get('maritalStatus')?.enable();
        },
        error: (error) => {
          this.loadingMaritalStatus = false;
          this.errorMaritalStatus = true;
        },
      });
  }

  retryMaritalStatus() {
    this.loadMaritalStatus();
  }

  loadDepartments() {
    this.loadingDepartments = true;
    this.errorDepartments = false;
    this.teacherForm.get('regionActual')?.disable();
    this.teacherForm.get('regionProcedencia')?.disable();

    this.ubigeoService.getDepartments().subscribe({
      next: (response) => {
        this.departmentsList = response.data;
        this.loadingDepartments = false;
        //this.teacherForm.get('regionActual')?.enable();
        //this.teacherForm.get('regionProcedencia')?.enable();
      },
      error: (error) => {
        this.loadingDepartments = false;
        this.errorDepartments = true;
      },
    });
  }

  retryDepartments() {
    this.loadDepartments();
  }

  loadProvincesNow(departmentCode: string) {
    this.loadingProvincesNow = true;
    this.errorProvincesNow = false;
    this.teacherForm.get('provinciaActual')?.disable();

    this.ubigeoService.getProvinces(departmentCode).subscribe({
      next: (response) => {
        this.provincesListNow = response.data;
        this.loadingProvincesNow = false;
        if(!this.teacherActive) this.teacherForm.get('provinciaActual')?.enable();
        if (this.ubigeoActual) {
          console.log('existe ubigeo actual');
          this.teacherForm
            .get('provinciaActual')
            ?.setValue(this.getAllByUbigeoCode(this.ubigeoActual, 2));
        } else {
          console.log('No existe ubigeo actual');
          this.teacherForm.get('provinciaActual')?.setValue(null);
        }
      },
      error: (error) => {
        this.loadingProvincesNow = false;
        this.errorProvincesNow = true;
      },
    });
  }

  retryProvincesNow() {
    const departmentCode = this.teacherForm.get('regionActual')?.value;
    if (departmentCode !== null) {
      this.loadProvincesNow(departmentCode);
    }
  }

  loadDistrictsNow(departmentCode: string, provinceCode: string) {
    this.loadingDistrictsNow = true;
    this.errorDistrictsNow = false;
    this.teacherForm.get('distritoActual')?.disable();

    this.ubigeoService.getDistricts(departmentCode, provinceCode).subscribe({
      next: (response) => {
        this.districtsListNow = response.data;
        this.loadingDistrictsNow = false;
        if (!this.teacherActive) this.teacherForm.get('distritoActual')?.enable();
        if (this.ubigeoActual) {
          console.log('existe ubigeo actual distrito');
          this.teacherForm.get('distritoActual')?.setValue(this.ubigeoActual);
        } else {
          console.log('no existe ubigeo actual distrito');
          this.teacherForm.get('distritoActual')?.setValue(null);
        }
      },
      error: (error) => {
        this.loadingDistrictsNow = false;
        this.errorDistrictsNow = true;
      },
    });
  }

  retryDistrictsNow() {
    const departmentCode = this.teacherForm.get('regionActual')?.value;
    const provinceCode = this.teacherForm.get('provinciaActual')?.value;
    if (departmentCode !== null && provinceCode !== null) {
      this.loadDistrictsNow(departmentCode, provinceCode);
    }
  }

  loadProvincesProcedencia(departmentCode: string) {
    this.loadingProvincesProcedencia = true;
    this.errorProvincesProcedencia = false;
    this.teacherForm.get('provinciaProcedencia')?.disable();

    this.ubigeoService.getProvinces(departmentCode).subscribe({
      next: (response) => {
        this.provincesListProcedencia = response.data;
        this.loadingProvincesProcedencia = false;
        if (!this.teacherActive) {
          this.teacherForm.get('provinciaProcedencia')?.enable();
          //this.teacherForm.get('provinciaProcedencia')?.setValue(null);
        }
        if (this.ubigeoProcedencia) {
          console.log('Existe Ubigeo Procedencia Provincia');
          this.teacherForm
            .get('provinciaProcedencia')
            ?.setValue(this.getAllByUbigeoCode(this.ubigeoProcedencia, 2));
        } else {
          console.log('NO Existe Ubigeo Procedencia Provincia');
          this.teacherForm.get('provinciaProcedencia')?.setValue(null);
        }
      },
      error: (error) => {
        this.loadingProvincesProcedencia = false;
        this.errorProvincesProcedencia = true;
      },
    });
  }

  retryProvincesProcedencia() {
    const departmentCode = this.teacherForm.get('regionProcedencia')?.value;
    if (departmentCode !== null) {
      this.loadProvincesProcedencia(departmentCode);
    }
  }

  loadDistrictsProcedencia(departmentCode: string, provinceCode: string) {
    this.loadingDistrictsProcedencia = true;
    this.errorDistrictsProcedencia = false;
    this.teacherForm.get('distritoProcedencia')?.disable();

    this.ubigeoService.getDistricts(departmentCode, provinceCode).subscribe({
      next: (response) => {
        this.districtsListProcedencia = response.data;
        this.loadingDistrictsProcedencia = false;
        if (!this.teacherActive) {
          this.teacherForm.get('distritoProcedencia')?.enable();
          this.teacherForm.get('distritoProcedencia')?.setValue(null);
          console.log("distrito en null");
          
        }
        if (this.ubigeoProcedencia) {
          console.log('Existe Ubigeo Procedencia DISTRITO');
          this.teacherForm
            .get('distritoProcedencia')
            ?.setValue(this.ubigeoProcedencia);
        } else {
          console.log('NO Existe Ubigeo Procedencia DISTRITO');
          this.teacherForm.get('distritoProcedencia')?.setValue(null);
        }
      },
      error: (error) => {
        this.loadingDistrictsProcedencia = false;
        this.errorDistrictsProcedencia = true;
      },
    });
  }

  retryDistrictsProcedencia() {
    const departmentCode = this.teacherForm.get('regionProcedencia')?.value;
    const provinceCode = this.teacherForm.get('provinciaProcedencia')?.value;
    if (departmentCode !== null && provinceCode !== null) {
      this.loadDistrictsProcedencia(departmentCode, provinceCode);
    }
  }

  submit() {
    if (this.teacherForm.valid) {
      this.loadingSaveTeacher = true;
      this.errorSaveTeacher = false;
      let teacher: DocenteRequest = this.fromTeacherFormToDocenteRequest();
      this.docenteService.save(teacher).subscribe({
        next: (response) => {
          this.loadingSaveTeacher = false;
          this.showInfo(`El docente con DNI : ${response.data.numDocumento} fue registrado correctamente.`)
        },
        error: (error) => {
          if (error.error.status === 409) {
            this.showError(error.error.detail);
          } else {
            this.showError('Error desconocido. Intentelo de nuevo...');
          }
          this.errorSaveTeacher = true;
          this.loadingSaveTeacher = false;
        },
      });
    } else {
      this.teacherForm.markAllAsTouched();
    }
  }

  reset() {
    this.resetVariables()
    this.teacherForm.reset();
    this.desactiveForm();
    this.teacherForm.get('documentType')?.setValue('001001');
  }

  notFoundTeacherClearForm() {
    const documentNumber = this.teacherForm.get('numDocument')?.value;
    this.teacherForm.reset();
    this.resetVariables()
    this.teacherForm.get('numDocument')?.setValue(documentNumber);
    this.teacherForm.get('documentType')?.setValue('001001');
  }

  searchByDocumentNumber() {
    const documentNumber = this.emptyToUndefined(
      this.teacherForm.get('numDocument')?.value
    );

    if (
      documentNumber != undefined &&
      this.teacherForm.get('numDocument')?.valid
    ) {
      this.loadingSearchTeacher = true;
      this.errorSearchTeacher = false;
      this.docenteService.getDetail(documentNumber).subscribe({
        next: (response) => {
          this.setFormTeacher(response.data);
          this.desactiveForm();
          this.teacherActive = response.data;
          this.loadingSearchTeacher = false;
        },
        error: (err) => {
          console.log(err);
          this.errorSearchTeacher = true;
          this.notFoundTeacherClearForm();
          this.loadingSearchTeacher = false;
          this.teacherActive = undefined;
          if (err.error.status === 404) {
            //this.showError(err.error.detail)
            this.activeForm();
            this.showInfo(
              'El docente aun no esta registrado. Proceda a registrarlo.'
            );
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

  isInvalid(controlName: string): boolean {
    const control = this.teacherForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  fromTeacherFormToDocenteRequest(): DocenteRequest {
    const teacher: DocenteRequest = {
      codTipoDocumento: this.teacherForm.get('documentType')?.value,
      numDocumento: this.teacherForm.get('numDocument')?.value,
      nombre: this.teacherForm.get('nameTeacher')?.value,
      apellidoPaterno: this.teacherForm.get('apellidoPaterno')?.value,
      apellidoMaterno: this.teacherForm.get('apellidoMaterno')?.value,
      fechaNacimiento: this.getDate(),

      emailPersonal: this.emptyToUndefined(
        this.teacherForm.get('personalEmail')?.value
      ),
      emailInstitucional: this.emptyToUndefined(
        this.teacherForm.get('institutionalEmail')?.value
      ),
      codGenero: this.emptyToUndefined(this.teacherForm.get('gender')?.value),
      direccion: this.emptyToUndefined(
        this.teacherForm.get('addressNow')?.value
      ),
      codUbigeoActual: this.emptyToUndefined(
        this.teacherForm.get('distritoActual')?.value
      ),
      codUbigeoProcedencia: this.emptyToUndefined(
        this.teacherForm.get('distritoProcedencia')?.value
      ),
      codEstadoCivil: this.emptyToUndefined(
        this.teacherForm.get('maritalStatus')?.value
      ),
      telefono: this.emptyToUndefined(this.teacherForm.get('cellphone')?.value),
      fotografia: this.emptyToUndefined(
        this.teacherForm.get('photograph')?.value
      ),

      estado: 1,
    };

    return teacher;
  }

  setFormTeacher(teacher: Docente | null) {
    if (teacher === null) {
      this.teacherForm = this.fb.group({
        numDocument: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(/^\d+$/),
          ],
        ],
        documentType: ['001001', [Validators.required]],

        nameTeacher: [
          { value: '', disabled: true },
          [Validators.required, Validators.maxLength(100)],
        ],
        apellidoPaterno: [
          { value: '', disabled: true },
          [Validators.required, Validators.maxLength(100)],
        ],
        apellidoMaterno: [
          { value: '', disabled: true },
          [Validators.required, Validators.maxLength(100)],
        ],

        personalEmail: [
          { value: '', disabled: true },
          [Validators.email, Validators.maxLength(120)],
        ],
        institutionalEmail: [
          { value: '', disabled: true },
          [Validators.email, Validators.maxLength(120)],
        ],

        birthdate: [{ value: '', disabled: true }],
        cellphone: [
          { value: '', disabled: true },
          [
            Validators.maxLength(20),
            Validators.pattern(/^(9\d{8}|\+\d{7,15})$/),
          ],
        ],

        gender: [{ value: null, disabled: true }],
        maritalStatus: [{ value: null, disabled: true }],

        photograph: [{ value: null, disabled: true }],

        regionActual: [{ value: null, disabled: true }],
        provinciaActual: [{ value: null, disabled: true }],
        distritoActual: [{ value: null, disabled: true }],
        addressNow: [{ value: '', disabled: true }],

        regionProcedencia: [{ value: null, disabled: true }],
        provinciaProcedencia: [{ value: null, disabled: true }],
        distritoProcedencia: [{ value: null, disabled: true }],
      });
    } else {
      this.teacherForm.get('numDocument')?.setValue(teacher.numDocumento);
      this.teacherForm
        .get('documentType')
        ?.setValue(teacher.codTipoDocumento.codigo);
      this.teacherForm.get('nameTeacher')?.setValue(teacher.nombre);
      this.teacherForm
        .get('apellidoPaterno')
        ?.setValue(teacher.apellidoPaterno);
      this.teacherForm
        .get('apellidoMaterno')
        ?.setValue(teacher.apellidoMaterno);
      this.teacherForm.get('personalEmail')?.setValue(teacher.emailPersonal);
      this.teacherForm
        .get('institutionalEmail')
        ?.setValue(teacher.emailInstitucional);
      this.teacherForm
        .get('birthdate')
        ?.setValue(this.formatDateToISO(teacher.fechaNacimiento));
      this.teacherForm.get('cellphone')?.setValue(teacher.telefono);
      this.teacherForm.get('gender')?.setValue(teacher.codGenero.codigo);
      this.teacherForm
        .get('maritalStatus')
        ?.setValue(teacher.codEstadoCivil.codigo);
      //this.teacherForm.get('photograph')?.setValue(teacher.fotografia);
      this.teacherForm
        .get('regionActual')
        ?.setValue(
          this.getAllByUbigeoCode(teacher.codUbigeoActual.codigoUbigeo, 1)
        );
      if (teacher.codUbigeoActual.codigoUbigeo) {
        this.ubigeoActual = teacher.codUbigeoActual.codigoUbigeo;
      } else {
        this.ubigeoActual = undefined;
      }
      this.teacherForm.get('addressNow')?.setValue(teacher.direccion);
      this.teacherForm
        .get('regionProcedencia')
        ?.setValue(
          this.getAllByUbigeoCode(teacher.codUbigeoProcedencia.codigoUbigeo, 1)
        );
      if (teacher.codUbigeoProcedencia.codigoUbigeo) {
        this.ubigeoProcedencia = teacher.codUbigeoProcedencia.codigoUbigeo;
      } else {
        this.ubigeoProcedencia = undefined;
      }
    }
  }

  private emptyToUndefined(value: any): any {
    if (value === null || value === undefined) return undefined;

    if (typeof value === 'string') {
      return value.trim() === '' ? undefined : value.trim();
    }

    return value;
  }

  private getDate(): string | undefined {
    const fecha = this.teacherForm.get('birthdate')?.value;

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

  private getAllByUbigeoCode(ubigeoCode: string, nivel: number): string {
    if (ubigeoCode !== null && ubigeoCode !== undefined) {
      switch (nivel) {
        case 1:
          return ubigeoCode.slice(0, 2);
        case 2:
          console.log(ubigeoCode.slice(2, 4));
          return ubigeoCode.slice(2, 4);
        case 3:
          console.log(ubigeoCode.slice(4, 6));
          return ubigeoCode.slice(4, 6);
        default:
          return '';
      }
    } else {
      return '';
    }
  }

  activeForm() {
    this.teacherForm.enable();
  }

  desactiveForm() {
    this.teacherForm.disable();
    this.teacherForm.get('numDocument')?.enable();
    this.teacherForm.get('documentType')?.enable();
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

  resetVariables() {
    this.teacherActive = undefined; 

    this.loadingDocumentType = false;
    this.loadingGender = false;
    this.loadingMaritalStatus = false;
    this.loadingDepartments = false;
    this.loadingProvincesNow = false;
    this.loadingDistrictsNow = false;
    this.loadingProvincesProcedencia = false;
    this.loadingDistrictsProcedencia = false;

    this.loadingSearchTeacher = false;
    this.loadingSaveTeacher = false;

    this.errorDocumentType = false;
    this.errorGender = false;
    this.errorMaritalStatus = false;
    this.errorDepartments = false;
    this.errorProvincesNow = false;
    this.errorDistrictsNow = false;
    this.errorProvincesProcedencia = false;
    this.errorDistrictsProcedencia = false;

    this.errorSearchTeacher = false;
    this.errorSaveTeacher = false;

    this.ubigeoActual = undefined;
    this.ubigeoProcedencia = undefined;
  }
}
