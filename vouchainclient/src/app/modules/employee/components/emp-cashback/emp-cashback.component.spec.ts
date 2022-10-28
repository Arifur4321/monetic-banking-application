import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpCashbackComponent } from './emp-cashback.component';

describe('EmpCashbackComponent', () => {
  let component: EmpCashbackComponent;
  let fixture: ComponentFixture<EmpCashbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpCashbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpCashbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
