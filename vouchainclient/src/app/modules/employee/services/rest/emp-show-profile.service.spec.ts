import { TestBed } from '@angular/core/testing';

import { EmpShowProfileService } from './emp-show-profile.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmpShowProfileService', () => {
  let service: EmpShowProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(EmpShowProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
