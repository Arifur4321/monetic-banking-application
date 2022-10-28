import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpVetrinaComponent } from './emp-vetrina.component';

describe('EmpVetrinaComponent', () => {
  let component: EmpVetrinaComponent;
  let fixture: ComponentFixture<EmpVetrinaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpVetrinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpVetrinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
