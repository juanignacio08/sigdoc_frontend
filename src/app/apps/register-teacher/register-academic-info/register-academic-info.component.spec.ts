import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAcademicInfoComponent } from './register-academic-info.component';

describe('RegisterAcademicInfoComponent', () => {
  let component: RegisterAcademicInfoComponent;
  let fixture: ComponentFixture<RegisterAcademicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterAcademicInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAcademicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
