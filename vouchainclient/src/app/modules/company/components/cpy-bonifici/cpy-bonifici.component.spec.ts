import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpyBonificiComponent } from './cpy-bonifici.component';

describe('CpyBonificiComponent', () => {
  let component: CpyBonificiComponent;
  let fixture: ComponentFixture<CpyBonificiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpyBonificiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyBonificiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
