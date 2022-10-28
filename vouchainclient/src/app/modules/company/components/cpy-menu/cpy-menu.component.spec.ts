import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpyMenuComponent } from './cpy-menu.component';

describe('CpyMenuComponent', () => {
  let component: CpyMenuComponent;
  let fixture: ComponentFixture<CpyMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpyMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
