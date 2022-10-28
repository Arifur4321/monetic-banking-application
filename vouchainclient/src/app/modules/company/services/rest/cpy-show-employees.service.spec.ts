import { TestBed } from '@angular/core/testing';

import { CpyShowEmployeesService } from './cpy-show-employees.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CpyShowEmployeesService', () => {
  let service: CpyShowEmployeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(CpyShowEmployeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
