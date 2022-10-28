import { TestBed } from '@angular/core/testing';

import { ModalsManagerService } from './modals-manager.service';
import { imports } from 'src/test-utility/test-utilities';

describe('ModalsManagerService', () => {
  let service: ModalsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        imports
      ]
    });
    service = TestBed.inject(ModalsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
