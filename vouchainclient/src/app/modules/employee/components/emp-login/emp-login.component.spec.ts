import { ComponentFixture, TestBed, getTestBed, tick, fakeAsync, waitForAsync } from '@angular/core/testing';

import { EmpLoginComponent } from './emp-login.component';

import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';


import { imports } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';
import * as myMessages from 'src/globals/messages';

import { ValidatorService } from 'src/app/services/validator.service';
import { EmpLoginService } from '../../services/rest/emp-login.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { EmployeeDTO } from 'src/app/model/employee-dto';

describe('EmpLoginComponent', () => {
  let component: EmpLoginComponent;
  let fixture: ComponentFixture<EmpLoginComponent>;
  let validatorService: ValidatorService;
  let translate: TranslateTestingUtility<EmpLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpLoginComponent ],
      imports:[
        imports
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpLoginComponent);
    component = fixture.componentInstance;
    translate = new TranslateTestingUtility(fixture, getTestBed());
    validatorService = fixture.debugElement.injector.get(ValidatorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain login button', () => {
    translate.updateTranslation();
    const loginButton: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;

    expect(loginButton.innerText).toEqual(translate.IT.LOGIN.LOGIN_LABEL);
  })


  describe('validation has effect', () => {

    it('mail field should have is-valid class with valid mail (checkEmail)', () => {
      let spy = spyOn(validatorService, 'isValidEmail')
        .and.returnValue(true);
      component.checkEmail();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "email" });

      expect(element.nativeElement).toHaveClass('is-valid');
    });

    it('mail field should have is-invalid class with invalid mail (checkEmail)', () => {
      let spy = spyOn(validatorService, 'isValidEmail')
        .and.returnValue(false);
      component.checkEmail();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "email" });

      expect(element.nativeElement).toHaveClass('is-invalid');
    });

    it('password field should have is-valid class with field not empty (checkPassword)', () => {
      let spy = spyOn(validatorService, 'isNotEmpty')
        .and.returnValue(true);
      component.checkPassword();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "password" });

      expect(element.nativeElement).toHaveClass('is-valid');
    });

    it('password field should have is-invalid class with empty field (checkPassword)', () => {
      let spy = spyOn(validatorService, 'isNotEmpty')
        .and.returnValue(false);
      component.checkPassword();
      fixture.detectChanges();
      let element = fixture.debugElement.query((de) => { return de.nativeElement.name === "password" });

      expect(element.nativeElement).toHaveClass('is-invalid');
    });
  });

  describe('onSubmitLoginForm', () => {
    let spyMail;
    let spyPsw;
    let empDTO: EmployeeDTO;
    let autenticatorService: AuthenticationService;
    let loginService: EmpLoginService;
    let router: Router;

    beforeEach(() => {
      autenticatorService = fixture.debugElement.injector.get(AuthenticationService);
      loginService = fixture.debugElement.injector.get(EmpLoginService);
      router = TestBed.get(Router);
      spyMail = spyOn(validatorService, 'isValidEmail').and.returnValue(true);
      spyPsw = spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      empDTO = new EmployeeDTO();
      fixture.detectChanges();
    });

    it('should call navigate for "employee/empDashboard" if onSubmitLoginForm is called with correct values', () => {
      empDTO.status = "OK";
      let spy = spyOn(loginService, 'authLoginEmp').and.returnValue(of(empDTO));
      spyOn(router, 'navigate');
      component.onSubmitLoginForm();

      expect(router.navigate).toHaveBeenCalledWith(['employee/empDashboard']);
    });

    it('should display generic error if response is negative', () => {
      empDTO.status = "KO";
      let spy = spyOn(loginService, 'authLoginEmp').and.returnValue(of(empDTO));
      component.onSubmitLoginForm();
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#mrc-login-error-description-generic'));

      expect(component.errorGeneric).toBeTrue();
      expect(element).toBeTruthy();
    });

    it('should display login fail if credentials are wrong', () => {
      empDTO.status = "KO";
      empDTO.errorDescription = myMessages.noUserFound;
      let spy = spyOn(loginService, 'authLoginEmp').and.returnValue(of(empDTO));
      component.onSubmitLoginForm();
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#errorDescription'));

      expect(component.loginFail).toBeTrue();
      expect(element).toBeTruthy();
    });

    it('should display the correct message if an error occurs', () => {
      let spy = spyOn(loginService, 'authLoginEmp').and.returnValue(throwError({status: 404}));
      component.onSubmitLoginForm();
      translate.updateTranslation();
      let element = fixture.debugElement.query(By.css('#mrc-login-error-description-generic'));
      expect(element.nativeElement.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

  });

});
