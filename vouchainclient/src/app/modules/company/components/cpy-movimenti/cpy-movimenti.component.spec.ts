import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpyMovimentiComponent } from './cpy-movimenti.component';

describe('CpyMovimentiComponent', () => {
  let component: CpyMovimentiComponent;
  let fixture: ComponentFixture<CpyMovimentiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpyMovimentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyMovimentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
