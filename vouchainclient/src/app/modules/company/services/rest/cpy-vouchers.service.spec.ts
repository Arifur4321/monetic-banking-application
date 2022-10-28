import { TestBed } from '@angular/core/testing';

import { CpyVouchersService } from './cpy-vouchers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CpyVouchersService', () => {
  let service: CpyVouchersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(CpyVouchersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
