import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmpSubmenuComponent } from './emp-submenu.component';

describe('EmpSubmenuComponent', () => {
  let component: EmpSubmenuComponent;
  let fixture: ComponentFixture<EmpSubmenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpSubmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpSubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
