import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpyProfileComponent } from './cpy-profile.component';

describe('CpyProfileComponent', () => {
  let component: CpyProfileComponent;
  let fixture: ComponentFixture<CpyProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
