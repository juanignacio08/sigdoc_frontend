import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Docente } from '@shared/models/decanatura/docente.model';
import { ExperienciaProfesional, ExperienciaProfesionalRequest } from '@shared/models/decanatura/docenteexperiencia.model';

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

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.action === 'edit' && this.workExperience) {
      this.setForm();
    }
  }

  initForm() {
    this.workExperienceForm = this.fb.group({
      empresa: ['', Validators.required],
      cargo: ['', Validators.required],
      descripcion: [''],
      fechaInicio: [null],
      fechaFin: [null],
      documento: [null],
      estado: [1],
    });
  }

  private setForm() {
    console.log(this.workExperience);

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.workExperienceForm.patchValue({
        documento: file,
      });
    }
  }

  submit() {
    if (this.workExperienceForm.valid && this.teacherActive) {
      this.activeModal.close(this.fromFormToProfetionalExperiencie());

      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      });
    } else {
      console.log('no entro');
    }
  }

  fromFormToProfetionalExperiencie(): ExperienciaProfesionalRequest {
    const workTeacher: ExperienciaProfesionalRequest = {
      experienciaProfesionalId: this.workExperience?.experienciaProfesionalId || 1,
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
