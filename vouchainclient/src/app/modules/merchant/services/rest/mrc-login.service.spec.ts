import { TestBed } from '@angular/core/testing';

import { MrcLoginService } from './mrc-login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MrcLoginService', () => {
  let service: MrcLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(MrcLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
