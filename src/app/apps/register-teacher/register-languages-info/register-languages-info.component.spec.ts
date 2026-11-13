import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLanguagesInfoComponent } from './register-languages-info.component';

describe('RegisterLanguagesInfoComponent', () => {
  let component: RegisterLanguagesInfoComponent;
  let fixture: ComponentFixture<RegisterLanguagesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterLanguagesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterLanguagesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
