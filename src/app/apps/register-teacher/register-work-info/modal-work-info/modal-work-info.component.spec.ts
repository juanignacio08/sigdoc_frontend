import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalWorkInfoComponent } from './modal-work-info.component';

describe('ModalWorkInfoComponent', () => {
  let component: ModalWorkInfoComponent;
  let fixture: ComponentFixture<ModalWorkInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalWorkInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalWorkInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
