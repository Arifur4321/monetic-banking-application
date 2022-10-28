import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpyDashboardComponent } from './cpy-dashboard.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CpyDashboardComponent', () => {
  let component: CpyDashboardComponent;
  let fixture: ComponentFixture<CpyDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpyDashboardComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
