import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenteLaboralCardComponent } from './docente-laboral-card.component';

describe('DocenteLaboralCardComponent', () => {
  let component: DocenteLaboralCardComponent;
  let fixture: ComponentFixture<DocenteLaboralCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocenteLaboralCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocenteLaboralCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
