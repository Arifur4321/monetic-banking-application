import { TestBed } from '@angular/core/testing';

import { CpyShowProfileService } from './cpy-show-profile.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CpyShowProfileService', () => {
  let service: CpyShowProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(CpyShowProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
