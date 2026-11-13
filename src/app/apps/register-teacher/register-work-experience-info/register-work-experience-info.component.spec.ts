import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWorkExperienceInfoComponent } from './register-work-experience-info.component';

describe('RegisterWorkExperienceInfoComponent', () => {
  let component: RegisterWorkExperienceInfoComponent;
  let fixture: ComponentFixture<RegisterWorkExperienceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterWorkExperienceInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterWorkExperienceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
