import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpDashboardComponent } from './emp-dashboard.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EmpDashboardComponent', () => {
  let component: EmpDashboardComponent;
  let fixture: ComponentFixture<EmpDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpDashboardComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
