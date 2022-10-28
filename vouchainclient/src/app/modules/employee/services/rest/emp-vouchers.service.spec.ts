import { TestBed } from '@angular/core/testing';

import { EmpVouchersService } from './emp-vouchers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmpVouchersService', () => {
  let service: EmpVouchersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(EmpVouchersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
