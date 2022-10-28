import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpySubmenuComponent } from './cpy-submenu.component';

describe('CpySubmenuComponent', () => {
  let component: CpySubmenuComponent;
  let fixture: ComponentFixture<CpySubmenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpySubmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpySubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
