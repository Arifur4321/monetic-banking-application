import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RouteGuardService } from './route-guard.service';
import { imports } from 'src/test-utility/test-utilities';
import { ModalsManagerService } from './modals-manager.service';
import { AuthenticationService } from './authentication.service';

describe('RouteGuardService', () => {
  let service: RouteGuardService;
  let managerService: ModalsManagerService;
  let authService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [imports],
    });
    service = TestBed.inject(RouteGuardService);
    managerService = TestBed.inject(ModalsManagerService);
    authService = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('forbiddenAccess should call error modal', fakeAsync(() => {
    let spy = spyOn(managerService, 'errorsModalGeneric');
    service.forbiddenAccess();
    tick(10);

    expect(spy).toHaveBeenCalled();
  }));
});
