import { Component, inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Docente } from '@shared/models/decanatura/docente.model';
import {
  ExperienciaProfesional,
  ExperienciaProfesionalRequest,
} from '@shared/models/decanatura/docenteexperiencia.model';
import { TablaMaestraService } from 'app/services/maestros/tabla-maestra.service';

@Component({
  selector: 'app-modal-work',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-work.component.html',
  styleUrl: './modal-work.component.scss',
})
export class ModalWorkComponent implements OnInit {
  @Input() workExperience?: ExperienciaProfesional;
  @Input() teacherActive?: Docente;
  @Input() action: string = 'add';
  @Input() title: string = 'Registrar Experiencia Profesional';

  workExperienceForm!: FormGroup;

  selectedFile?: File;
  fileError: string | null = null;

  masterTableService = inject(TablaMaestraService);

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    if (this.action !== 'view' && this.action !== 'delete') {
      this.initForm();

      if (this.action === 'edit' && this.workExperience) {
        this.setForm();
      }
    }
  }

  initForm() {
    this.workExperienceForm = this.fb.group({
      empresa: ['', Validators.required],
      cargo: ['', Validators.required],
      descripcion: [''],
      fechaInicio: [null],
      fechaFin: [null],
      estado: [1],
    });
  }

  private setForm() {
    this.workExperienceForm
      .get('empresa')
      ?.setValue(this.workExperience?.empresa);
    this.workExperienceForm.get('cargo')?.setValue(this.workExperience?.cargo);

    if (this.workExperience?.descripcion) {
      this.workExperienceForm
        .get('descripcion')
        ?.setValue(this.workExperience?.descripcion);
    }

    if (this.workExperience?.fechaInicio) {
      this.workExperienceForm
        .get('fechaInicio')
        ?.setValue(this.formatDateToISO(this.workExperience?.fechaInicio));
    }
    if (this.workExperience?.fechaFin) {
      this.workExperienceForm
        .get('fechaFin')
        ?.setValue(this.formatDateToISO(this.workExperience?.fechaFin));
    }

    if (this.workExperience?.documento) {
      this.workExperienceForm
        .get('documento')
        ?.setValue(this.workExperience?.documento.denominacion);
    }

    this.workExperienceForm
      .get('estado')
      ?.setValue(this.workExperience?.estado);
  }

  isInvalid(controlPath: string): boolean {
    const control = this.workExperienceForm.get(controlPath);
    return !!(control && control.invalid && control.touched);
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

  submit() {
    if (this.workExperienceForm.valid && this.teacherActive) {
      this.activeModal.close({
        data: this.fromFormToProfetionalExperiencie(),
        file: this.selectedFile,
      });

      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      });
    } else {
      console.log('no entro');
    }
  }

  confirmDelete() {
    if (this.teacherActive && this.workExperience) {
      this.activeModal.close({
        data: this.workExperience,
        file: undefined,
      });

      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      });
    }
  }

  fromFormToProfetionalExperiencie(): ExperienciaProfesionalRequest {
    const workTeacher: ExperienciaProfesionalRequest = {
      experienciaProfesionalId:
        this.workExperience?.experienciaProfesionalId || 1,
      docenteId: this.teacherActive?.docenteId || 0,
      empresa: this.workExperienceForm.get('empresa')?.value,
      cargo: this.workExperienceForm.get('cargo')?.value,
      descripcion: this.emptyToUndefined(
        this.workExperienceForm.get('descripcion')?.value,
      ),
      fechaInicio: this.emptyToUndefined(this.getDate('fechaInicio')),
      fechaFin: this.emptyToUndefined(this.getDate('fechaFin')),
      estado: 1,
    };

    if (this.selectedFile) {
      workTeacher.documento = {
        documentoId: this.workExperience?.documento?.documentoId || 1,
        //denominacion: this.getDateAndTimeCurrent() + '_' + this.teacherActive?.nombre + '_' + this.teacherActive?.apellidoPaterno + '_grado_academico.pdf',
        denominacion: this.selectedFile.name,
        codTipoDocumento: this.masterTableService.COD_CERTIFICADO_DIPLOMA,
        docenteId: this.teacherActive?.docenteId || 0,
        estado: 1,
      };
    }

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

  close() {
    this.activeModal.dismiss();
    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
    });
  }

  private formatDateToISO(fecha: string): string {
    if (fecha !== null && fecha !== undefined) {
      const [dia, mes, anio] = fecha.split('/');
      return `${anio}-${mes}-${dia}`;
    }
    return '';
  }

  private getDate(controlName: string): string | undefined {
    const fecha = this.workExperienceForm.get(controlName)?.value;

    if (fecha) {
      const [anio, mes, dia] = fecha.split('-');
      const fechaFormateada = `${dia}/${mes}/${anio}`;
      return fechaFormateada;
    } else {
      return undefined;
    }
  }
}
