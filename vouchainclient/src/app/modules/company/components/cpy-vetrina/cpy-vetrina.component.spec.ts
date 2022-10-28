import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpyVetrinaComponent } from './cpy-vetrina.component';

describe('CpyVetrinaComponent', () => {
  let component: CpyVetrinaComponent;
  let fixture: ComponentFixture<CpyVetrinaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpyVetrinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyVetrinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
