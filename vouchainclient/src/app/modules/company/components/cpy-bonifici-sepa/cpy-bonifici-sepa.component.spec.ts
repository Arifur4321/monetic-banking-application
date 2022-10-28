import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpyBonificiSepaComponent } from './cpy-bonifici-sepa.component';

describe('CpyBonificiSepaComponent', () => {
  let component: CpyBonificiSepaComponent;
  let fixture: ComponentFixture<CpyBonificiSepaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpyBonificiSepaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyBonificiSepaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
