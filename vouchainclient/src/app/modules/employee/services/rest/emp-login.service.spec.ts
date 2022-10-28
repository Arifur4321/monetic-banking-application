import { TestBed } from '@angular/core/testing';

import { EmpLoginService } from './emp-login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmpLoginService', () => {
  let service: EmpLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(EmpLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
