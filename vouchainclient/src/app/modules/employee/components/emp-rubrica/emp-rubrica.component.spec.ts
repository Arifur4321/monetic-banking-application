import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpRubricaComponent } from './emp-rubrica.component';

describe('EmpRubricaComponent', () => {
  let component: EmpRubricaComponent;
  let fixture: ComponentFixture<EmpRubricaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpRubricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
