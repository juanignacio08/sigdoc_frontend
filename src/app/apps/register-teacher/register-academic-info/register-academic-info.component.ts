import { Component, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { RegisterTeacherComponent } from '../register-teacher.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-academic-info',
  imports: [ReactiveFormsModule],
  templateUrl: './register-academic-info.component.html',
  styleUrl: './register-academic-info.component.scss',
})
export class RegisterAcademicInfoComponent implements OnInit {

  constructor(public parent: RegisterTeacherComponent) {
  }

  ngOnInit(): void {
    this.addAcademicForm();
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
