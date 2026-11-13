import { Component, inject, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { StepperComponent } from '@shared/components/stepper/stepper.component';
import { SessionStorageService } from 'app/services/session-storage/session-storage.service';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-register-teacher',
  imports: [StepperComponent, RouterOutlet],
  templateUrl: './register-teacher.component.html',
  styleUrl: './register-teacher.component.scss',
})
export class RegisterTeacherComponent implements OnInit {
  currentStep = 0;
  sectionTitle: string = 'Datos Personales';

  private readonly stepMap: Record<string, { step: number; title: string }> = {
    'personal-data': { step: 0, title: 'Datos Personales' },
    'academic-data': { step: 1, title: 'Formación Académica' },
    'work-data': {step: 2, title: 'Información Profesional'},
    'work-experience-data': { step: 3, title: 'Experiencia Profesional' },
    'languages-data': {step: 4, title: 'Idiomas'}
  };

  sessionStorageService = inject(SessionStorageService);

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.syncStepWithRoute(this.router.url);

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.syncStepWithRoute(event.urlAfterRedirects);    
    });
    
  }

  private syncStepWithRoute(url: string): void {
    const segment = url.split('/').pop();
    if (!segment) return;

    const config = this.stepMap[segment];
    if (!config) return;

    this.currentStep = config.step;
    this.sectionTitle = config.title;
  }

}
