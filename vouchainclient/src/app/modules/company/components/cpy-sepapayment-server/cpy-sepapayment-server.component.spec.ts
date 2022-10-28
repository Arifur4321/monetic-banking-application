import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpySepapaymentServerComponent } from './cpy-sepapayment-server.component';

describe('CpySepapaymentServerComponent', () => {
  let component: CpySepapaymentServerComponent;
  let fixture: ComponentFixture<CpySepapaymentServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpySepapaymentServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpySepapaymentServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
