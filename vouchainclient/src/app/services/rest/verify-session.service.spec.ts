import { TestBed } from '@angular/core/testing';

import { VerifySessionService } from './verify-session.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VerifySessionService', () => {
  let service: VerifySessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
       ]
    });
    service = TestBed.inject(VerifySessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
