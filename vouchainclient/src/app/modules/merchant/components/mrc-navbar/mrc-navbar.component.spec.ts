import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MrcNavbarComponent } from './mrc-navbar.component';
import { MrcDashboardComponent } from '../mrc-dashboard/mrc-dashboard.component';

import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { imports } from 'src/test-utility/test-utilities';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { VerifySessionService } from 'src/app/services/rest/verify-session.service';

import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';

describe('MrcNavbarComponent', () => {
  let component: MrcNavbarComponent;
  let fixture: ComponentFixture<MrcNavbarComponent>;
  let authenticatorService: AuthenticationService;
  let verifySessionService: VerifySessionService;
  let router : Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MrcNavbarComponent ],
      imports:[
        imports,
        RouterTestingModule.withRoutes([
          {path:'merchant', component:MrcDashboardComponent}])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrcNavbarComponent);
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
    expect(spy).toHaveBeenCalledWith(['/merchant']);
  });
});
