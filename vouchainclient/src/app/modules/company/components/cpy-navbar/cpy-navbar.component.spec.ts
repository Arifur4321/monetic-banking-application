import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CpyNavbarComponent } from './cpy-navbar.component';
import { CpyDashboardComponent } from '../cpy-dashboard/cpy-dashboard.component';

import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { imports } from 'src/test-utility/test-utilities';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { VerifySessionService } from 'src/app/services/rest/verify-session.service';

import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';

describe('CpyNavbarComponent', () => {
  let component: CpyNavbarComponent;
  let fixture: ComponentFixture<CpyNavbarComponent>;
  let authenticatorService: AuthenticationService;
  let verifySessionService: VerifySessionService;
  let router : Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpyNavbarComponent ],
      imports: [
        imports,
        RouterTestingModule.withRoutes([
          {path:'company', component:CpyDashboardComponent}])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyNavbarComponent);
    component = fixture.componentInstance;
    authenticatorService = fixture.debugElement.injector.get(AuthenticationService);
    verifySessionService = fixture.debugElement.injector.get(VerifySessionService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call clear session on logout', () => {
    let response: SimpleResponseDTO = new SimpleResponseDTO();
    response.status = 'OK';
    spyOn(verifySessionService, 'resetSession').and.returnValue(of(response));
    let spy = spyOn(authenticatorService, 'clearSessionStorage');
    component.logout();
    expect(spy).toHaveBeenCalled();
  });

  it('should call navigate to company', () => {
    let response: SimpleResponseDTO = new SimpleResponseDTO();
    response.status = 'OK';
    spyOn(verifySessionService, 'resetSession').and.returnValue(of(response));
    spyOn(authenticatorService, 'clearSessionStorage');
    let spy = spyOn(router, 'navigate');
    component.logout();
    expect(spy).toHaveBeenCalledWith(['/company']);
  });

});
