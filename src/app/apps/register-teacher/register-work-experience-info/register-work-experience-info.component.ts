import { Component, inject, OnInit } from '@angular/core';
import { Docente } from '@shared/models/decanatura/docente.model';
import { SessionStorageService } from 'app/services/session-storage/session-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register-work-experience-info',
  imports: [],
  templateUrl: './register-work-experience-info.component.html',
  styleUrl: './register-work-experience-info.component.scss',
})
export class RegisterWorkExperienceInfoComponent implements OnInit {
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
    if (this.teacherActive) {
      this.router.navigate(['../languages-data'], {
        relativeTo: this.route,
      });
    }
  }

  goToBackStep() {
    if (this.teacherActive) {
      this.router.navigate(['../work-data'], {
        relativeTo: this.route,
      });
    }
  }
}
