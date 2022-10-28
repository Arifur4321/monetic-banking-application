import { TestBed } from '@angular/core/testing';

import { MrcSignupService } from './mrc-signup.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MrcSignupService', () => {
  let service: MrcSignupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(MrcSignupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
