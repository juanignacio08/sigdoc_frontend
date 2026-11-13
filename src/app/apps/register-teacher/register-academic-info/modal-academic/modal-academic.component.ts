import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Docente } from '@shared/models/decanatura/docente.model';
import {
  DocenteAcademico,
  DocenteAcademicoRequest,
} from '@shared/models/decanatura/docenteacademico.model';
import { TablaMaestra } from '@shared/models/maestros/tablamaestra.model';
import { TablaMaestraService } from 'app/services/maestros/tabla-maestra.service';

@Component({
  selector: 'app-modal-academic',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-academic.component.html',
  styleUrl: './modal-academic.component.scss',
})
export class ModalAcademicComponent implements OnInit {
  @Input() teacherAcademic?: DocenteAcademico;
  @Input() teacherActive?: Docente;
  @Input() action: string = 'add';
  @Input() title: string = 'Registrar Grado Académico';

  academicInfoForm!: FormGroup;
  selectedFile?: File;
  fileError: string | null = null;

  academicGradeList: TablaMaestra[] = [];

  carreras: any[] = [];
  universidades: any[] = [];
  resultadoCarrera: any[] = [];
  resultadoUniversidad: any[] = [];
  mostrarListaCarrera: boolean = false;
  mostrarListaUniversidad: boolean = false;

  controls = {
    codeAcademicGrade: { loading: false, error: false },
  };

  masterTableService = inject(TablaMaestraService);

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private http: HttpClient,
    // private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    if (this.action !== 'view' && this.action !== 'delete') {
      this.initForm();
      this.loadAcademicGrade();
      this.loadProfessions();
      this.loadUniversities();
      if (this.action === 'edit' && this.teacherAcademic) {
        this.setForm();
      }
    }
  }

  private initForm() {
    this.academicInfoForm = this.fb.group({
      codGradoAcademico: [null, Validators.required],
      tituloProfesional: ['', Validators.required],
      institucionEgreso: ['', Validators.required],
      fechaObtencion: [null],
      especialidad: [''],
    });
  }

  private setForm() {
    this.academicInfoForm
      .get('codGradoAcademico')
      ?.setValue(this.teacherAcademic?.codGradoAcademico.codigo);
    this.academicInfoForm
      .get('tituloProfesional')
      ?.setValue(this.teacherAcademic?.tituloProfesional);
    this.academicInfoForm
      .get('institucionEgreso')
      ?.setValue(this.teacherAcademic?.institucionEgreso);
    if (this.teacherAcademic?.fechaObtencion) {
      this.academicInfoForm
        .get('fechaObtencion')
        ?.setValue(this.formatDateToISO(this.teacherAcademic?.fechaObtencion));
    }
    this.academicInfoForm
      .get('especialidad')
      ?.setValue(this.teacherAcademic?.especialidad);
    if (this.teacherAcademic?.documento) {
      this.academicInfoForm
        .get('documento')
        ?.setValue(this.teacherAcademic?.documento.denominacion);
    }
  }

  loadUniversities() {
    this.http.get<any[]>('assets/data/universidades.json').subscribe((data) => {
      this.universidades = data;
    });
  }

  loadProfessions() {
    this.http
      .get<any[]>('assets/data/professions-data.json')
      .subscribe((data) => {
        this.carreras = data;
      });
  }

  loadAcademicGrade() {
    this.controls.codeAcademicGrade.loading = true;
    this.controls.codeAcademicGrade.error = false;
    this.academicInfoForm.get('codGradoAcademico')?.disable();

    this.masterTableService
      .getActiveItemsByTable(this.masterTableService.GRADO_ACADEMICO)
      .subscribe({
        next: (response) => {
          this.academicGradeList = response.data;
          this.controls.codeAcademicGrade.loading = false;
          this.academicInfoForm.get('codGradoAcademico')?.enable();
        },
        error: (error) => {
          this.controls.codeAcademicGrade.loading = false;
          this.controls.codeAcademicGrade.error = true;
        },
      });
  }

  retryAcademicGrade() {
    this.loadAcademicGrade();
  }

  onInputProfession() {
    const valor = this.academicInfoForm.get('tituloProfesional')?.value || '';

    if (!valor.trim()) {
      this.resultadoCarrera = [];
      return;
    }

    this.resultadoCarrera = this.carreras
      .filter((c) => c.nombre.toLowerCase().includes(valor.toLowerCase()))
      .slice(0, 5);

    this.mostrarListaCarrera = true;
  }

  onInputUniversity() {
    const valor = this.academicInfoForm.get('institucionEgreso')?.value || '';

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

  seleccionarProfession(profession: any) {
    this.academicInfoForm.get('tituloProfesional')?.setValue(profession.nombre);
    this.mostrarListaCarrera = false;
    this.resultadoCarrera = [];
  }

  seleccionarUniversity(university: any) {
    this.academicInfoForm.get('institucionEgreso')?.setValue(university.nombre);
    this.mostrarListaUniversidad = false;
    this.resultadoUniversidad = [];
  }

  cerrarListaProfession() {
    setTimeout(() => (this.mostrarListaCarrera = false), 150);
  }

  cerrarListaUniversity() {
    setTimeout(() => (this.mostrarListaUniversidad = false), 150);
  }

  isInvalid(controlPath: string): boolean {
    const control = this.academicInfoForm.get(controlPath);
    return !!(control && control.invalid && control.touched);
  }

  submit() {
    if (this.academicInfoForm.valid && this.teacherActive) {
      this.activeModal.close({
        data: this.fromFormToAcademicTeacher(),
        file: this.selectedFile,
      });

      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      });
    }
  }

  confirmDelete() {
    if (this.teacherActive && this.teacherAcademic) {
      this.activeModal.close({
        data: this.teacherAcademic,
        file: undefined,
      });

      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      });
    }
  }

  close() {
    this.activeModal.dismiss();
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (file.type !== 'application/pdf') {
      this.fileError = 'Solo se permiten archivos PDF';
      this.selectedFile = undefined;
      input.value = '';
      return;
    }

    const maxSize = 20 * 1024 * 1024; // 20MB

    if (file.size > maxSize) {
      this.fileError = 'El archivo no debe superar los 20 MB';
      this.selectedFile = undefined;
      input.value = '';
      return;
    }

    this.fileError = null;
    this.selectedFile = file;
  }

  fromFormToAcademicTeacher(): DocenteAcademicoRequest {
    const academicTeacher: DocenteAcademicoRequest = {
      docenteAcademicoId: this.teacherAcademic?.docenteAcademicoId || 1,
      docenteId: this.teacherActive?.docenteId || 0,
      codGradoAcademico: this.academicInfoForm.get('codGradoAcademico')?.value,
      tituloProfesional: this.academicInfoForm.get('tituloProfesional')?.value,
      institucionEgreso: this.academicInfoForm.get('institucionEgreso')?.value,
      fechaObtencion: this.emptyToUndefined(this.getDate()),
      especialidad: this.emptyToUndefined(
        this.academicInfoForm.get('especialidad')?.value,
      ),
      estado: 1,
    };

    if (this.selectedFile) {
      academicTeacher.documento = {
        documentoId: this.teacherAcademic?.documento?.documentoId || 1,
        //denominacion: this.getDateAndTimeCurrent() + '_' + this.teacherActive?.nombre + '_' + this.teacherActive?.apellidoPaterno + '_grado_academico.pdf',
        denominacion: this.selectedFile.name,
        codTipoDocumento: this.masterTableService.COD_GRADO_TITULO,
        docenteId: this.teacherActive?.docenteId || 0,
        estado: 1,
      };
    }

    return this.removeUndefined(academicTeacher);
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
    const fecha = this.academicInfoForm.get('fechaObtencion')?.value;

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

  // private getDateAndTimeCurrent(): string {
  //   const fechaActual = new Date();
  //   const anio = fechaActual.getFullYear();
  //   const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
  //   const dia = String(fechaActual.getDate()).padStart(2, '0');
  //   const horas = String(fechaActual.getHours()).padStart(2, '0');
  //   const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
  //   const segundos = String(fechaActual.getSeconds()).padStart(2, '0');
  //   return `${anio}${mes}${dia}_${horas}${minutos}${segundos}`;
  // }

  // openPdfModal(teacherAcademicId: number) {
  //   const modalRef = this.modalService.open(ModalPdfViewerComponent, {
  //     size: 'xl',
  //     centered: true,
  //     backdrop: 'static',
  //     scrollable: true,
  //   });

  //   modalRef.componentInstance.docenteAcademicoId = teacherAcademicId;
  // }
}
