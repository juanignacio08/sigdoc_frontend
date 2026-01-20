import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterOutlet,
} from '@angular/router';
import { StepperComponent } from '@shared/components/stepper/stepper.component';
import { SessionStorageService } from 'app/services/session-storage/session-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-teacher',
  imports: [StepperComponent, RouterOutlet],
  templateUrl: './register-teacher.component.html',
  styleUrl: './register-teacher.component.scss',
})
export class RegisterTeacherComponent implements OnInit {
  currentStep = 0;
  sectionTitle: string = 'Datos Personales';

  sessionStorageService = inject(SessionStorageService);

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentStep =
      this.sessionStorageService.get<number>('currentStep') || 0;
    this.sectionTitle =
      this.sessionStorageService.get<string>('sectionTitle') ||
      'Datos Personales';
  }

  goToNextStep() {
    this.currentStep++;

    console.log(this.currentStep);

    switch (this.currentStep) {
      case 0:
        this.router.navigate(['personal-data'], {
          relativeTo: this.route,
        });
        break;
      case 1:
        //this.getAcademicDataArray().push(this.createAcademicDataForm());
        this.router.navigate(['academic-data'], {
          relativeTo: this.route,
        });
        break;
    }
  }

  // saveAcademic(index: number) {
  //   const form = this.getAcademicDataArray().at(index) as FormGroup;

  //   if (form.invalid) return;

  //   const payload = form.value;

  //   console.log(payload);

  //   // this.academicService.save(payload).subscribe({
  //   //   next: () => {
  //   //     form.patchValue({ saved: true });
  //   //     form.disable(); // opcional: bloquear después de guardar
  //   //   },
  //   // });
  // }

  // createAcademicDataForm(): FormGroup {
  //   return this.fb.group({
  //     codGradoAcademico: [null, Validators.required],
  //     tituloProfesional: ['', Validators.required],
  //     institucionEgreso: ['', Validators.required],
  //     fechaObtencion: [null, Validators.required],
  //     especialidad: ['', Validators.required],
  //     estado: [1],
  //     saved: [false],
  //   });
  // }

  // getAcademicDataArray() {
  //   return this.teacherForm.get('academicData') as FormArray;
  // }
}
