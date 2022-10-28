import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpyPaymentComponent } from './cpy-payment.component';

describe('CpyPaymentComponent', () => {
  let component: CpyPaymentComponent;
  let fixture: ComponentFixture<CpyPaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpyPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
