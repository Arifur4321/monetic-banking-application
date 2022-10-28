import { TestBed } from '@angular/core/testing';

import { CpyLoginService } from './cpy-login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CpyLoginService', () => {
  let service: CpyLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(CpyLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
