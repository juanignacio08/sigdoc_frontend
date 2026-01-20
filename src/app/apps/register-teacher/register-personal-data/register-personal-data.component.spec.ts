import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPersonalDataComponent } from './register-personal-data.component';

describe('RegisterPersonalDataComponent', () => {
  let component: RegisterPersonalDataComponent;
  let fixture: ComponentFixture<RegisterPersonalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPersonalDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
