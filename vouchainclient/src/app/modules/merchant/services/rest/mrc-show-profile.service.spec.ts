import { TestBed } from '@angular/core/testing';

import { MrcShowProfileService } from './mrc-show-profile.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MrcShowProfileService', () => {
  let service: MrcShowProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(MrcShowProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
