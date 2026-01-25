import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAcademicComponent } from './modal-academic.component';

describe('ModalAcademicComponent', () => {
  let component: ModalAcademicComponent;
  let fixture: ComponentFixture<ModalAcademicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAcademicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAcademicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
