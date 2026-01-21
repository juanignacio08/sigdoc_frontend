import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Docente } from '@shared/models/decanatura/docente.model';
import { TablaMaestraService } from 'app/services/maestros/tabla-maestra.service';
import { SessionStorageService } from 'app/services/session-storage/session-storage.service';

@Component({
  selector: 'app-register-academic-info',
  imports: [ReactiveFormsModule, NgbTooltip],
  templateUrl: './register-academic-info.component.html',
  styleUrl: './register-academic-info.component.scss',
})
export class RegisterAcademicInfoComponent implements OnInit {
  teacherActive?: Docente | null;

  academicInfoForm!: FormGroup;

  masterTableService = inject(TablaMaestraService);
  sessionStorageService = inject(SessionStorageService);  

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.teacherActive = this.sessionStorageService.get<Docente>('teacherActive');

    this.initForm();

  }

  private initForm() {
    this.academicInfoForm = this.fb.group({
      codGradoAcademico: [null, Validators.required],
      tituloProfesional: ['', Validators.required],
      institucionEgreso: ['', Validators.required],
      fechaObtencion: [null, Validators.required],
      especialidad: ['', Validators.required],
    });
  }

  getAcademicDataArray() {
    // return this.parent.getAcademicDataArray();
  }

  addAcademicForm() {
    // this.getAcademicDataArray().push(
    //   this.parent.createAcademicDataForm()
    // );
  }

  saveAcademic(index: number) {
    // this.parent.saveAcademic(index);
  }

  isInvalid(control: string): boolean { 
    // return this.parent.isInvalid(`academicData.${control}`); 
    return false;
  }
}
