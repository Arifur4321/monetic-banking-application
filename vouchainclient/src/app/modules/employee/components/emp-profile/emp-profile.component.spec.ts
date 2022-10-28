import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpProfileComponent } from './emp-profile.component';

describe('EmpProfileComponent', () => {
  let component: EmpProfileComponent;
  let fixture: ComponentFixture<EmpProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
