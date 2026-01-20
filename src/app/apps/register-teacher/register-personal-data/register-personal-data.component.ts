import { Component, inject, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ModalInformationComponent } from '@shared/components/modal-information/modal-information.component';
import {
  Docente,
  DocenteRequest,
} from '@shared/models/decanatura/docente.model';
import { TablaMaestra } from '@shared/models/maestros/tablamaestra.model';
import { Ubigeo } from '@shared/models/maestros/ubigeo.model';
import { DocenteService } from 'app/services/decanatura/docente.service';
import { TablaMaestraService } from 'app/services/maestros/tabla-maestra.service';
import { UbigeoService } from 'app/services/maestros/ubigeo.service';
import { SessionStorageService } from 'app/services/session-storage/session-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-personal-data',
  imports: [ReactiveFormsModule, NgbTooltip],
  templateUrl: './register-personal-data.component.html',
  styleUrl: './register-personal-data.component.scss',
})
export class RegisterPersonalDataComponent implements OnInit {
  teacherActive?: Docente | null;

  ubigeoActual?: string;
  ubigeoProcedencia?: string;

  personalForm!: FormGroup;

  documentTypeList: TablaMaestra[] = [];
  genderList: TablaMaestra[] = [];
  maritalStatusList: TablaMaestra[] = [];
  departmentsList: Ubigeo[] = [];
  provincesListNow: Ubigeo[] = [];
  districtsListNow: Ubigeo[] = [];
  provincesListProcedencia: Ubigeo[] = [];
  districtsListProcedencia: Ubigeo[] = [];

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

  private initialValue!: any;

  masterTableService = inject(TablaMaestraService);
  ubigeoService = inject(UbigeoService);
  docenteService = inject(DocenteService);
  sessionStorageService = inject(SessionStorageService);

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.teacherActive =
      this.sessionStorageService.get<Docente>('teacherActive');

    this.sessionStorageService.set('currentStep', 0);
    this.sessionStorageService.set('sectionTitle', 'Datos Personales');

    this.initForm();

    if (this.teacherActive) {
      this.setFormTeacher(this.teacherActive);
    }

    this.loadDocumentType();
    this.loadGender();
    this.loadMaritalStatus();
    this.loadDepartments();

    this.personalForm.get('regionActual')?.valueChanges.subscribe((value) => {
      this.provincesListNow = [];
      this.districtsListNow = [];
      this.personalForm.get('provinciaActual')?.setValue(null);
      this.personalForm.get('distritoActual')?.setValue(null);
      if (value != null && value !== '') {
        this.onRegionChange(value);
      }
    });

    this.personalForm
      .get('provinciaActual')
      ?.valueChanges.subscribe((value) => {
        this.districtsListNow = [];
        this.personalForm.get('distritoActual')?.setValue(null);
        if (value != null && value !== '') {
          this.onProvinceChange(value);
        }
      });

    this.personalForm
      .get('regionProcedencia')
      ?.valueChanges.subscribe((value) => {
        this.provincesListProcedencia = [];
        this.districtsListProcedencia = [];
        this.personalForm.get('provinciaProcedencia')?.setValue(null);
        this.personalForm.get('distritoProcedencia')?.setValue(null);
        if (value != null && value !== '') {
          this.onRegionProcedenciaChange(value);
        }
      });

    this.personalForm
      .get('provinciaProcedencia')
      ?.valueChanges.subscribe((value) => {
        this.districtsListProcedencia = [];
        this.personalForm.get('distritoProcedencia')?.setValue(null);
        if (value != null && value !== '') {
          this.onProvinceProcedenciaChange(value);
        }
      });
  }

  onProvinceProcedenciaChange(provinceCode: string) {
    const departmentCode = this.personalForm.get('regionProcedencia')?.value;
    if (departmentCode !== null) {
      this.loadDistrictsProcedencia(departmentCode, provinceCode);
    }
  }

  onRegionProcedenciaChange(codigoRegion: string) {
    this.loadProvincesProcedencia(codigoRegion);
  }

  onProvinceChange(provinceCode: string) {
    const departmentCode = this.personalForm.get('regionActual')?.value;
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
    this.personalForm.get('documentType')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.TIPO_DOCUMENTO_IDENTIDAD)
      .subscribe({
        next: (response) => {
          this.documentTypeList = response.data;
          this.loadingDocumentType = false;
          this.personalForm.get('documentType')?.enable();
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
    this.personalForm.get('gender')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.GENERO)
      .subscribe({
        next: (response) => {
          this.genderList = response.data;
          this.loadingGender = false;
          this.personalForm.get('gender')?.enable();
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
    this.personalForm.get('maritalStatus')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.ESTADO_CIVIL)
      .subscribe({
        next: (response) => {
          this.maritalStatusList = response.data;
          this.loadingMaritalStatus = false;
          this.personalForm.get('maritalStatus')?.enable();
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
    this.personalForm.get('regionActual')?.disable();
    this.personalForm.get('regionProcedencia')?.disable();

    this.ubigeoService.getDepartments().subscribe({
      next: (response) => {
        this.departmentsList = response.data;
        this.loadingDepartments = false;
        this.personalForm.get('regionActual')?.enable();
        this.personalForm.get('regionProcedencia')?.enable();
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
    this.personalForm.get('provinciaActual')?.disable();

    this.ubigeoService.getProvinces(departmentCode).subscribe({
      next: (response) => {
        this.provincesListNow = response.data;
        this.loadingProvincesNow = false;
        this.personalForm.get('provinciaActual')?.enable();

        if (this.ubigeoActual) {
          this.personalForm
            .get('provinciaActual')
            ?.setValue(this.getAllByUbigeoCode(this.ubigeoActual, 2));
        } else {
          console.log('No existe ubigeo actual');
          this.personalForm.get('provinciaActual')?.setValue(null);
        }
      },
      error: (error) => {
        this.loadingProvincesNow = false;
        this.errorProvincesNow = true;
      },
    });
  }

  retryProvincesNow() {
    const departmentCode = this.personalForm.get('regionActual')?.value;
    if (departmentCode !== null) {
      this.loadProvincesNow(departmentCode);
    }
  }

  loadDistrictsNow(departmentCode: string, provinceCode: string) {
    this.loadingDistrictsNow = true;
    this.errorDistrictsNow = false;
    this.personalForm.get('distritoActual')?.disable();

    this.ubigeoService.getDistricts(departmentCode, provinceCode).subscribe({
      next: (response) => {
        this.districtsListNow = response.data;
        this.loadingDistrictsNow = false;
        this.personalForm.get('distritoActual')?.enable();

        if (this.ubigeoActual) {
          console.log('existe ubigeo actual distrito');
          this.personalForm.get('distritoActual')?.setValue(this.ubigeoActual);
        } else {
          console.log('no existe ubigeo actual distrito');
          this.personalForm.get('distritoActual')?.setValue(null);
        }
      },
      error: (error) => {
        this.loadingDistrictsNow = false;
        this.errorDistrictsNow = true;
      },
    });
  }

  retryDistrictsNow() {
    const departmentCode = this.personalForm.get('regionActual')?.value;
    const provinceCode = this.personalForm.get('provinciaActual')?.value;
    if (departmentCode !== null && provinceCode !== null) {
      this.loadDistrictsNow(departmentCode, provinceCode);
    }
  }

  loadProvincesProcedencia(departmentCode: string) {
    this.loadingProvincesProcedencia = true;
    this.errorProvincesProcedencia = false;
    this.personalForm.get('provinciaProcedencia')?.disable();

    this.ubigeoService.getProvinces(departmentCode).subscribe({
      next: (response) => {
        this.provincesListProcedencia = response.data;
        this.loadingProvincesProcedencia = false;
        this.personalForm.get('provinciaProcedencia')?.enable();

        if (this.ubigeoProcedencia) {
          console.log('Existe Ubigeo Procedencia Provincia');
          this.personalForm
            .get('provinciaProcedencia')
            ?.setValue(this.getAllByUbigeoCode(this.ubigeoProcedencia, 2));
        } else {
          console.log('NO Existe Ubigeo Procedencia Provincia');
          this.personalForm.get('provinciaProcedencia')?.setValue(null);
        }
      },
      error: (error) => {
        this.loadingProvincesProcedencia = false;
        this.errorProvincesProcedencia = true;
      },
    });
  }

  retryProvincesProcedencia() {
    const departmentCode = this.personalForm.get('regionProcedencia')?.value;
    if (departmentCode !== null) {
      this.loadProvincesProcedencia(departmentCode);
    }
  }

  loadDistrictsProcedencia(departmentCode: string, provinceCode: string) {
    this.loadingDistrictsProcedencia = true;
    this.errorDistrictsProcedencia = false;
    this.personalForm.get('distritoProcedencia')?.disable();

    this.ubigeoService.getDistricts(departmentCode, provinceCode).subscribe({
      next: (response) => {
        this.districtsListProcedencia = response.data;
        this.loadingDistrictsProcedencia = false;
        this.personalForm.get('distritoProcedencia')?.enable();
        if (!this.teacherActive) {
          this.personalForm.get('distritoProcedencia')?.setValue(null);
          console.log('distrito en null');
        }
        if (this.ubigeoProcedencia) {
          console.log('Existe Ubigeo Procedencia DISTRITO');
          this.personalForm
            .get('distritoProcedencia')
            ?.setValue(this.ubigeoProcedencia);
        } else {
          console.log('NO Existe Ubigeo Procedencia DISTRITO');
          this.personalForm.get('distritoProcedencia')?.setValue(null);
        }
      },
      error: (error) => {
        this.loadingDistrictsProcedencia = false;
        this.errorDistrictsProcedencia = true;
      },
    });
  }

  retryDistrictsProcedencia() {
    const departmentCode = this.personalForm.get('regionProcedencia')?.value;
    const provinceCode = this.personalForm.get('provinciaProcedencia')?.value;
    if (departmentCode !== null && provinceCode !== null) {
      this.loadDistrictsProcedencia(departmentCode, provinceCode);
    }
  }

  submit() {
    if (this.teacherActive) {
      this.updateTeacher();
    } else {
      this.saveTeacher();
    }
  }

  updateTeacher() {
    if (this.personalForm.valid && this.personalForm.dirty) {
      this.loadingSaveTeacher = true;
      this.errorSaveTeacher = false;
      let teacher: DocenteRequest = this.frompersonalFormToDocenteRequest();
      console.log(teacher);

      this.docenteService.update(teacher).subscribe({
        next: (response) => {
          this.loadingSaveTeacher = false;
          this.showInfo(`Datos editados correctamente.`);
          this.sessionStorageService.set('teacherActive', response.data);
          this.teacherActive = response.data;
          this.personalForm.markAsPristine();
          this.openModalInformative();
        },
        error: (error) => {
          if ([409, 400, 404, 500].includes(error.error.status)) {
            this.showError(error.error.detail);
          } else {
            this.showError('Error desconocido. Intentelo de nuevo...');
          }
          this.errorSaveTeacher = true;
          this.loadingSaveTeacher = false;
        },
      });
    } else {
      this.showInfo('No se realizaron cambios en los datos.');
    }
  }

  saveTeacher() {
    if (this.personalForm.invalid) {
      this.personalForm.markAllAsTouched();
      return;
    }

    if (this.personalForm.valid && this.personalForm.dirty) {
      this.loadingSaveTeacher = true;
      this.errorSaveTeacher = false;
      let teacher: DocenteRequest = this.frompersonalFormToDocenteRequest();
      console.log(teacher);

      this.docenteService.save(teacher).subscribe({
        next: (response) => {
          this.loadingSaveTeacher = false;
          this.showInfo(
            `El docente con DNI : ${response.data.numDocumento} fue registrado correctamente.`,
          );
          this.sessionStorageService.set('teacherActive', response.data);
          this.teacherActive = response.data;
          this.personalForm.markAsPristine();
          this.openModalInformative();
          //this.goToNextStep();
        },
        error: (error) => {
          console.log(error.error);

          if ([409, 400, 404, 500].includes(error.error.status)) {
            this.showError(error.error.detail);
          } else {
            this.showError('Error desconocido. Intentelo de nuevo...');
          }
          this.errorSaveTeacher = true;
          this.loadingSaveTeacher = false;
        },
      });
    } else {
      this.showInfo('No se realizaron cambios en los datos.');
    }
  }

  goToNextStep() {
    if (this.teacherActive) {
      this.sessionStorageService.set('teacherActive', this.teacherActive);
      this.sessionStorageService.set('currentStep', 1);
      this.router.navigate(['../academic-data'], {
        relativeTo: this.route,
      });
    }
  }

  reset() {
    this.resetVariables();
    this.personalForm.reset();
    this.personalForm.get('documentType')?.setValue('001001');
  }

  notFoundTeacherClearForm() {
    const documentNumber = this.personalForm.get('numDocument')?.value;
    this.personalForm.reset();
    this.resetVariables();
    this.personalForm.get('numDocument')?.setValue(documentNumber);
    this.personalForm.get('documentType')?.setValue('001001');
  }

  searchByDocumentNumber() {
    const documentNumber = this.emptyToUndefined(
      this.personalForm.get('numDocument')?.value,
    );

    if (
      documentNumber != undefined &&
      this.personalForm.get('numDocument')?.valid
    ) {
      this.loadingSearchTeacher = true;
      this.errorSearchTeacher = false;
      this.docenteService.getDetail(documentNumber).subscribe({
        next: (response) => {
          this.teacherActive = response.data;
          this.sessionStorageService.set('teacherActive', this.teacherActive);
          this.setFormTeacher(this.teacherActive);
          this.loadingSearchTeacher = false;
        },
        error: (err) => {
          console.log(err);
          this.errorSearchTeacher = true;
          this.notFoundTeacherClearForm();
          this.loadingSearchTeacher = false;
          this.teacherActive = undefined;
          this.sessionStorageService.remove('teacherActive');
          if (err.error.status === 404) {
            //this.showError(err.error.detail)
            this.showInfo(
              'El docente aun no esta registrado. Proceda a registrarlo.',
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

  isInvalid(controlPath: string): boolean {
    const control = this.personalForm.get(controlPath);
    return !!(control && control.invalid && control.touched);
  }

  frompersonalFormToDocenteRequest(): DocenteRequest {
    const teacher: DocenteRequest = {
      codTipoDocumento: this.personalForm.get('documentType')?.value,
      numDocumento: this.personalForm.get('numDocument')?.value,
      nombre: this.personalForm.get('nameTeacher')?.value,
      apellidoPaterno: this.personalForm.get('apellidoPaterno')?.value,
      apellidoMaterno: this.personalForm.get('apellidoMaterno')?.value,
      fechaNacimiento: this.getDate(),

      emailPersonal: this.emptyToUndefined(
        this.personalForm.get('personalEmail')?.value,
      ),
      emailInstitucional: this.emptyToUndefined(
        this.personalForm.get('institutionalEmail')?.value,
      ),
      codGenero: this.emptyToUndefined(this.personalForm.get('gender')?.value),
      direccion: this.emptyToUndefined(
        this.personalForm.get('addressNow')?.value,
      ),
      codUbigeoActual: this.emptyToUndefined(
        this.personalForm.get('distritoActual')?.value,
      ),
      codUbigeoProcedencia: this.emptyToUndefined(
        this.personalForm.get('distritoProcedencia')?.value,
      ),
      codEstadoCivil: this.emptyToUndefined(
        this.personalForm.get('maritalStatus')?.value,
      ),
      telefono: this.emptyToUndefined(
        this.personalForm.get('cellphone')?.value,
      ),
      fotografia: this.emptyToUndefined(
        this.personalForm.get('photograph')?.value,
      ),

      estado: 1,
    };

    return this.removeUndefined(teacher);
  }

  private initForm() {
    this.personalForm = this.fb.group({
      numDocument: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^\d+$/),
        ],
      ],
      documentType: ['001001', Validators.required],

      nameTeacher: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],

      personalEmail: ['', Validators.email],
      institutionalEmail: ['', Validators.email],

      birthdate: [''],
      cellphone: ['', Validators.pattern(/^(9\d{8}|\+\d{7,15})$/)],

      gender: [null],
      maritalStatus: [null],

      photograph: [''],

      regionActual: [null],
      provinciaActual: [null],
      distritoActual: [null],
      addressNow: [''],

      regionProcedencia: [null],
      provinciaProcedencia: [null],
      distritoProcedencia: [null],
    });
  }

  setFormTeacher(teacher: Docente | null) {
    if (teacher !== null) {
      this.personalForm.get('numDocument')?.setValue(teacher.numDocumento);
      this.personalForm
        .get('documentType')
        ?.setValue(teacher.codTipoDocumento.codigo);
      this.personalForm.get('nameTeacher')?.setValue(teacher.nombre);
      this.personalForm
        .get('apellidoPaterno')
        ?.setValue(teacher.apellidoPaterno);
      this.personalForm
        .get('apellidoMaterno')
        ?.setValue(teacher.apellidoMaterno);
      this.personalForm
        .get('personalEmail')
        ?.setValue(teacher.emailPersonal != null ? teacher.emailPersonal : '');
      this.personalForm
        .get('institutionalEmail')
        ?.setValue(
          teacher.emailInstitucional != null ? teacher.emailInstitucional : '',
        );
      this.personalForm
        .get('birthdate')
        ?.setValue(this.formatDateToISO(teacher.fechaNacimiento));
      this.personalForm
        .get('cellphone')
        ?.setValue(teacher.telefono != null ? teacher.telefono : '');
      this.personalForm
        .get('gender')
        ?.setValue(
          teacher.codGenero.codigo != null ? teacher.codGenero.codigo : '',
        );
      this.personalForm
        .get('maritalStatus')
        ?.setValue(
          teacher.codEstadoCivil.codigo != null
            ? teacher.codEstadoCivil.codigo
            : '',
        );

      this.personalForm
        .get('regionActual')
        ?.setValue(
          this.getAllByUbigeoCode(teacher.codUbigeoActual.codigoUbigeo, 1),
        );

      this.ubigeoActual = teacher.codUbigeoActual.codigoUbigeo || undefined;

      this.personalForm.get('addressNow')?.setValue(teacher.direccion);

      this.personalForm
        .get('regionProcedencia')
        ?.setValue(
          this.getAllByUbigeoCode(teacher.codUbigeoProcedencia.codigoUbigeo, 1),
        );

      this.ubigeoProcedencia =
        teacher.codUbigeoProcedencia.codigoUbigeo || undefined;

      this.personalForm.markAsPristine(); 
    }
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

  private getDate(): string | undefined {
    const fecha = this.personalForm.get('birthdate')?.value;

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

  private getAllByUbigeoCode(ubigeoCode: string, nivel: number): string | null {
    console.log(ubigeoCode);

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
      return null;
    }
  }

  // activeForm() {
  //   this.personalForm.enable();
  // }

  // desactiveForm() {
  //   this.personalForm.disable();
  //   this.personalForm.get('numDocument')?.enable();
  //   this.personalForm.get('documentType')?.enable();
  // }

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
    this.sessionStorageService.remove('teacherActive');

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

  openModalInformative() {
    const modalRef = this.modalService.open(ModalInformationComponent, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      scrollable: true,
    });

    modalRef.componentInstance.teacher = this.teacherActive;

    // opcional: recibir resultado cuando se cierre
    modalRef.result.then(
      (result) => {
        console.log('Cerrando Modal');
      },
      (reason) => {
        // dismissed (esc o backdrop)
      },
    );
  }
}
