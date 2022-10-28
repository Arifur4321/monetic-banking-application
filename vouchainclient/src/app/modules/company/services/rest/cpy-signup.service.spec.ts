import { TestBed } from '@angular/core/testing';

import { CpySignupService } from './cpy-signup.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CpySignupService', () => {
  let service: CpySignupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(CpySignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
