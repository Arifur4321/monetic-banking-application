import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpyCashbackComponent } from './cpy-cashback.component';

describe('CpyCashbackComponent', () => {
  let component: CpyCashbackComponent;
  let fixture: ComponentFixture<CpyCashbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpyCashbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyCashbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
