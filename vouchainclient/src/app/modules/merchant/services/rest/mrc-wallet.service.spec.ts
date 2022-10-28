import { TestBed } from '@angular/core/testing';

import { MrcWalletService } from './mrc-wallet.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MrcWalletService', () => {
  let service: MrcWalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(MrcWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
