import { TestBed } from '@angular/core/testing';

import { EmpInvitationcodeService } from './emp-invitationcode.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmpInvitationcodeService', () => {
  let service: EmpInvitationcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(EmpInvitationcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
