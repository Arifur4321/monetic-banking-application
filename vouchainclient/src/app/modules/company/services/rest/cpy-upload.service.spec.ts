import { TestBed } from '@angular/core/testing';

import { CpyUploadService } from './cpy-upload.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CpyUploadService', () => {
  let service: CpyUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
      ]
    });
    service = TestBed.inject(CpyUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
