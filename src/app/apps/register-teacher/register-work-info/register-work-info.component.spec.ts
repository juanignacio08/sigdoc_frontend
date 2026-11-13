import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterWorkInfoComponent } from './register-work-info.component';

describe('RegisterWorkInfoComponent', () => {
  let component: RegisterWorkInfoComponent;
  let fixture: ComponentFixture<RegisterWorkInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterWorkInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterWorkInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
