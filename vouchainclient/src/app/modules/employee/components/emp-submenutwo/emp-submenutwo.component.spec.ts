import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpSubmenutwoComponent } from './emp-submenutwo.component';

describe('EmpSubmenutwoComponent', () => {
  let component: EmpSubmenutwoComponent;
  let fixture: ComponentFixture<EmpSubmenutwoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpSubmenutwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpSubmenutwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
