import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpyGooglepayComponent } from './cpy-googlepay.component';

describe('CpyGooglepayComponent', () => {
  let component: CpyGooglepayComponent;
  let fixture: ComponentFixture<CpyGooglepayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpyGooglepayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyGooglepayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
