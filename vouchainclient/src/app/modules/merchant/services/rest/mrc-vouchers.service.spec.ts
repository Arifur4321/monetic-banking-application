import { TestBed } from '@angular/core/testing';

import { MrcVouchersService } from './mrc-vouchers.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MrcVouchersService', () => {
  let service: MrcVouchersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(MrcVouchersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
