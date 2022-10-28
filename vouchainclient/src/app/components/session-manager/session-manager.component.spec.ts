import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SessionManagerComponent } from './session-manager.component';
import { imports } from 'src/test-utility/test-utilities';
import * as myMessages from 'src/globals/messages';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { VerifySessionService } from 'src/app/services/rest/verify-session.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';
import { of, throwError } from 'rxjs';
import { CompanyDTO } from 'src/app/model/company-dto';
import { CpyLoginComponent } from 'src/app/modules/company/components/cpy-login/cpy-login.component';
import { CpyLoginService } from 'src/app/modules/company/services/rest/cpy-login.service';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { EmpLoginService } from 'src/app/modules/employee/services/rest/emp-login.service';
import { MrcLoginService } from 'src/app/modules/merchant/services/rest/mrc-login.service';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

describe('SessionManagerComponent', () => {
  let component: SessionManagerComponent;
  let fixture: ComponentFixture<SessionManagerComponent>;
  let router: Router;
  let rSpy;
  let verifySessionService: VerifySessionService;
  let authenticatorService: AuthenticationService;
  let modalsManager: ModalsManagerService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SessionManagerComponent],
      imports: [
        imports,
        RouterTestingModule.withRoutes([{ path: 'externalRedirect', component: MockComponent }]),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionManagerComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    rSpy = spyOn(router, 'navigate');
    verifySessionService = fixture.debugElement.injector.get(VerifySessionService);
    authenticatorService = fixture.debugElement.injector.get(AuthenticationService);
    modalsManager = fixture.debugElement.injector.get(ModalsManagerService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('goToHome', () => {

    describe('if sessionExpired', () => {
      let res;
      let spyAuth;

      beforeEach(() => {
        component.sessionMessage = myMessages.sessionExpired;
        spyAuth = spyOn(authenticatorService, 'clearSessionStorage');
        res = new SimpleResponseDTO();

      });

      describe('if loginDTO exist', () => {
        let logDTO;

        beforeEach(() => {
          logDTO = new CompanyDTO();
          logDTO.usrEmail = 'prova@email.it';
          component.loginDTO = logDTO;
        });

        it('should call verify session using the email', () => {
          let spy = spyOn(verifySessionService, 'resetSession').and.returnValue(of(res));
          component.goToHome();

          expect(spy).toHaveBeenCalledWith(logDTO.usrEmail);
        });

        it('should reset session if status is ok', () => {
          res.status = 'OK';
          spyOn(verifySessionService, 'resetSession').and.returnValue(of(res));
          component.goToHome();

          expect(spyAuth).toHaveBeenCalled();
        });

        it('should redirect if status is ok', () => {
          res.status = 'OK';
          spyOn(verifySessionService, 'resetSession').and.returnValue(of(res));
          component.goToHome();

          expect(rSpy).toHaveBeenCalledWith(['/externalRedirect', { externalUrl: component.homepage }]);
        });

        it('should call error modal if status is not ok', () => {
          res.status = 'KO';
          spyOn(verifySessionService, 'resetSession').and.returnValue(of(res));
          let eSpy = spyOn(modalsManager, 'errorsModalGeneric').and.callThrough();
          component.goToHome();

          expect(eSpy).toHaveBeenCalled();
        });

        it('should call error modal if service return an error', () => {
          spyOn(verifySessionService, 'resetSession').and.returnValue(throwError({ status: 404 }));
          let eSpy = spyOn(modalsManager, 'errorsModalGeneric').and.callThrough();
          component.goToHome();

          expect(eSpy).toHaveBeenCalled();
        });



      });

      describe('if loginDTO doesn\'t exist', () => {

        beforeEach(() => {
        });

        it('should reset session if status is ok', () => {
          res.status = 'OK';
          spyOn(verifySessionService, 'resetSession').and.returnValue(of(res));
          component.goToHome();

          expect(spyAuth).toHaveBeenCalled();
        });

        it('should redirect if status is ok', () => {
          res.status = 'OK';
          spyOn(verifySessionService, 'resetSession').and.returnValue(of(res));
          component.goToHome();

          expect(rSpy).toHaveBeenCalledWith(['/externalRedirect', { externalUrl: component.homepage }]);
        });

        it('should call error modal if status is not ok', () => {
          res.status = 'KO';
          spyOn(verifySessionService, 'resetSession').and.returnValue(of(res));
          let eSpy = spyOn(modalsManager, 'errorsModalGeneric').and.callThrough();
          component.goToHome();

          expect(eSpy).toHaveBeenCalled();
        });

        it('should call error modal if service return an error', () => {
          spyOn(verifySessionService, 'resetSession').and.returnValue(throwError({ status: 404 }));
          let eSpy = spyOn(modalsManager, 'errorsModalGeneric').and.callThrough();
          component.goToHome();

          expect(eSpy).toHaveBeenCalled();
        });
      });

      it('should redirect to home if sessionMessage is not sessionExpired', () => {
        component.sessionMessage = '';
        component.goToHome();
        expect(rSpy).toHaveBeenCalledWith(['/externalRedirect', { externalUrl: component.homepage }]);
      });

    });
  });

    describe('reconnect', () => {
      let res;
      let eSpy;

      beforeEach(() => {
        res = new SimpleResponseDTO();
        eSpy = spyOn(modalsManager, 'errorsModalGeneric').and.callThrough();
        
      });

      describe('response ok', () => {
        let spyUser;
        let spyEmail;
        let spyProfile;
        let spyId;

        beforeEach(() => {
          res.status = 'OK';
          spyUser = spyOn(authenticatorService, 'setUserSession');
          spyEmail = spyOn(authenticatorService, 'setEmailSession');
          spyProfile = spyOn(authenticatorService, 'setProfile');
          spyId = spyOn(authenticatorService, 'setSessionId');
          spyOn(verifySessionService, 'forceUpdateSession').and.returnValue(of(res));
        });

        describe('case company', () => {
          let cpy: CompanyDTO;
          let cpyLoginService: CpyLoginService;

          beforeEach(() => {
            spyOn(authenticatorService, 'getLoggedUserEmail').and.returnValue('prova@email.it');
            component.profile = 'company';
            cpy = new CompanyDTO();
            cpy.status = 'OK';
            cpy.usrId = '1';
            cpy.usrEmail = 'prova@email.it';
            component.loginDTO = cpy;
            cpyLoginService = fixture.debugElement.injector.get(CpyLoginService);
            
          });

          it('should set up session (cpy)', () => {
            spyOn(cpyLoginService, 'authLoginCpy').and.returnValue(of(cpy));
            component.reconnect();
            expect(spyUser).toHaveBeenCalled();
            expect(spyEmail).toHaveBeenCalled();
            expect(spyProfile).toHaveBeenCalled();
            expect(spyId).toHaveBeenCalled();
          });

          it('should call cpy dashboard if a contract has been registered', () => {
            spyOn(cpyLoginService, 'authLoginCpy').and.returnValue(of(cpy));
            cpy.cpyContractChecked = 'true';
            component.reconnect();
            expect(rSpy).toHaveBeenCalledWith(['company/cpyDashboard']);
          });

          it('should call upload contract if a contract has not been registered', () => {
            spyOn(cpyLoginService, 'authLoginCpy').and.returnValue(of(cpy));
            cpy.cpyContractChecked = 'false';
            component.reconnect();
            expect(rSpy).toHaveBeenCalledWith(['company/cpyUploadCtr']);
          });

          it('should call error modal if response is not ok', () => {
            spyOn(cpyLoginService, 'authLoginCpy').and.returnValue(of(cpy));
            cpy.status = 'KO';
            component.reconnect();
    
            expect(eSpy).toHaveBeenCalled();
          });
    
          it('should call error modal if service return an error', () => {
            spyOn(cpyLoginService, 'authLoginCpy').and.returnValue(throwError({ status: 404 }));
            component.reconnect();
    
            expect(eSpy).toHaveBeenCalled();
          });
        });

        describe('case employee', () => {
          let emp: EmployeeDTO;
          let empLoginService: EmpLoginService;

          beforeEach(() => {
            spyOn(authenticatorService, 'getLoggedUserEmail').and.returnValue('prova2@email.it');
            component.loginDTO = emp;
            component.profile = 'employee';
            emp = new EmployeeDTO();
            emp.status = 'OK';
            emp.usrId = '2';
            emp.usrEmail = 'prova2@email.it';
            component.loginDTO = emp;
            empLoginService = fixture.debugElement.injector.get(EmpLoginService);
          });

          it('should set up session', () => {
            spyOn(empLoginService, 'authLoginEmp').and.returnValue(of(emp));
            component.reconnect();
            expect(spyUser).toHaveBeenCalled();
            expect(spyEmail).toHaveBeenCalled();
            expect(spyProfile).toHaveBeenCalled();
            expect(spyId).toHaveBeenCalled();
          });

          it('should call emp dashboard', () => {
            spyOn(empLoginService, 'authLoginEmp').and.returnValue(of(emp));
            component.reconnect();
            expect(rSpy).toHaveBeenCalledWith(['/employee/empDashboard/']);
          });

          it('should call error modal if response is not ok', () => {
            spyOn(empLoginService, 'authLoginEmp').and.returnValue(of(emp));
            emp.status = 'KO';
            component.reconnect();
    
            expect(eSpy).toHaveBeenCalled();
          });
    
          it('should call error modal if service return an error', () => {
            spyOn(empLoginService, 'authLoginEmp').and.returnValue(throwError({ status: 404 }));
            component.reconnect();
    
            expect(eSpy).toHaveBeenCalled();
          });
        });

        describe('case merchant', () => {
          let mrc: MerchantDTO;
          let mrcLoginService: MrcLoginService;

          beforeEach(() => {
            spyOn(authenticatorService, 'getLoggedUserEmail').and.returnValue('prova3@email.it');

            component.profile = 'merchant';
            mrc = new MerchantDTO();
            mrc.status = 'OK';
            mrc.usrId = '3';
            mrc.usrEmail = 'prova3@email.it';
            component.loginDTO = mrc;
            mrcLoginService = fixture.debugElement.injector.get(MrcLoginService);
          });

          it('should set up session', () => {
            spyOn(mrcLoginService, 'authLoginMrc').and.returnValue(of(mrc));
            component.reconnect();
            expect(spyUser).toHaveBeenCalled();
            expect(spyEmail).toHaveBeenCalled();
            expect(spyProfile).toHaveBeenCalled();
            expect(spyId).toHaveBeenCalled();
          });

          it('should call mrc dashboard', () => {
            spyOn(mrcLoginService, 'authLoginMrc').and.returnValue(of(mrc));
            component.reconnect();
            expect(rSpy).toHaveBeenCalledWith(['/merchant/mrcDashboard/']);
          });

          it('should call error modal if response is not ok', () => {
            spyOn(mrcLoginService, 'authLoginMrc').and.returnValue(of(mrc));
            mrc.status = 'KO';
            component.reconnect();
    
            expect(eSpy).toHaveBeenCalled();
          });
    
          it('should call error modal if service return an error', () => {
            spyOn(mrcLoginService, 'authLoginMrc').and.returnValue(throwError({ status: 404 }));
            component.reconnect();
    
            expect(eSpy).toHaveBeenCalled();
          });
        });

      });

      it('should call error modal if response is not ok', () => {
        component.loginDTO = new CompanyDTO();
        component.loginDTO.email = 'prova@email.it';
        spyOn(verifySessionService, 'forceUpdateSession').and.returnValue(of(res));
        res.status = 'KO';
        component.reconnect();

        expect(eSpy).toHaveBeenCalled();
      });

      it('should call error modal if service return an error', () => {
        component.loginDTO = new CompanyDTO();
        component.loginDTO.email = 'prova@email.it';
        spyOn(verifySessionService, 'forceUpdateSession').and.returnValue(throwError({ status: 404 }));
        component.reconnect();

        expect(eSpy).toHaveBeenCalled();
      });

    });
  
});

class MockComponent { };

