import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Docente } from '@shared/models/decanatura/docente.model';
import { SessionStorageService } from 'app/services/session-storage/session-storage.service';

@Component({
  selector: 'app-register-languages-info',
  imports: [],
  templateUrl: './register-languages-info.component.html',
  styleUrl: './register-languages-info.component.scss',
})
export class RegisterLanguagesInfoComponent implements OnInit {
  teacherActive?: Docente | null;

  sessionStorageService = inject(SessionStorageService);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.teacherActive =
      this.sessionStorageService.get<Docente>('teacherActive');
    if (!this.teacherActive) {
      this.router.navigate(['/apps/register-teacher/personal-data']);
      return;
    }
  }

  goToNextStep() {
    // if (this.teacherActive) {
    //   this.router.navigate(['../work-data'], {
    //     relativeTo: this.route,
    //   });
    // }
  }

  goToBackStep() {
    if (this.teacherActive) {
      this.router.navigate(['../work-experience-data'], {
        relativeTo: this.route,
      });
    }
  }
}
