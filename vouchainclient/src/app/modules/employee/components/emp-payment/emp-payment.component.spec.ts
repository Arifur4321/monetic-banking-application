import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpPaymentComponent } from './emp-payment.component';

describe('EmpPaymentComponent', () => {
  let component: EmpPaymentComponent;
  let fixture: ComponentFixture<EmpPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
