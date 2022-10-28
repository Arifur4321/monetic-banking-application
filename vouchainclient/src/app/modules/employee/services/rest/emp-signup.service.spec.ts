import { TestBed } from '@angular/core/testing';

import { EmpSignupService } from './emp-signup.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmpSignupService', () => {
  let service: EmpSignupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(EmpSignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
