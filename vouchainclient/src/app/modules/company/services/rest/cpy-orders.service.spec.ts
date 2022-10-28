import { TestBed } from '@angular/core/testing';

import { CpyOrdersService } from './cpy-orders.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CpyOrdersService', () => {
  let service: CpyOrdersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(CpyOrdersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); 
  });
});
