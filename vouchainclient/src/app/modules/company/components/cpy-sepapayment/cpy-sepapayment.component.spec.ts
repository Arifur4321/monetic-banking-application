import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpySepapaymentComponent } from './cpy-sepapayment.component';

describe('CpySepapaymentComponent', () => {
  let component: CpySepapaymentComponent;
  let fixture: ComponentFixture<CpySepapaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpySepapaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpySepapaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
