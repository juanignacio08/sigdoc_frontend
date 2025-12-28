import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  imports: [],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {
  @Input() steps: string[] = [];
  @Input() currentStep = 0;
}
