import { TestBed } from '@angular/core/testing';

import { EmpShowMerchantsService } from './emp-show-merchants.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmpShowMerchantsService', () => {
  let service: EmpShowMerchantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(EmpShowMerchantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
