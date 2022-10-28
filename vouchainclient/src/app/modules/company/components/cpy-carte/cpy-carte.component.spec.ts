import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpyCarteComponent } from './cpy-carte.component';

describe('CpyCarteComponent', () => {
  let component: CpyCarteComponent;
  let fixture: ComponentFixture<CpyCarteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpyCarteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
