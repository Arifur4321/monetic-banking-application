import { TestBed } from '@angular/core/testing';

import { GeographicService } from './geographic.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GeographicService', () => {
  let service: GeographicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(GeographicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
