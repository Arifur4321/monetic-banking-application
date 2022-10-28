import { TestBed } from '@angular/core/testing';

import { UserPasswordRecoveryService } from './user-password-recovery.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserPasswordRecoveryService', () => {
  let service: UserPasswordRecoveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[ 
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UserPasswordRecoveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
