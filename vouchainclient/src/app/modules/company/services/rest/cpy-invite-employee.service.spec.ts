import { TestBed } from '@angular/core/testing';

import { CpyInviteEmployeeService } from './cpy-invite-employee.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CpyInviteEmployeeService', () => {
  let service: CpyInviteEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]});
    service = TestBed.inject(CpyInviteEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
