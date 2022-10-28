import { ComponentFixture, TestBed, fakeAsync, tick, getTestBed, waitForAsync } from '@angular/core/testing';
import { CpyLoginComponent } from './cpy-login.component';

import { FormsModule } from '@angular/forms';
import { Location } from "@angular/common";
import { Router } from '@angular/router';

import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

//Utility
import { imports } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';

//Custom Messages 
import * as myMessages from 'src/globals/messages';

//Models
import { CompanyDTO } from 'src/app/model/company-dto';

//Services 
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CpyLoginService } from '../../services/rest/cpy-login.service';
import { ValidatorService } from 'src/app/services/validator.service';


describe('CpyLoginComponent', () => {
  let component: CpyLoginComponent;
  let fixture: ComponentFixture<CpyLoginComponent>;
  let validatorService: ValidatorService;
  let translate: TranslateTestingUtility<CpyLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CpyLoginComponent],
      imports:
        [ imports,
          FormsModule
        ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpyLoginComponent);
    component = fixture.componentInstance;
    translate = new TranslateTestingUtility(fixture, getTestBed());
    validatorService = fixture.debugElement.injector.get(ValidatorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  it('should be in "" ', () => {
    const location = TestBed.get(Location);
    expect(location.path()).toBe('');
  });

  describe('onSubmitLoginForm()', () => {
    let spyMail;
    let spyPsw;
    let cpyDTO: CompanyDTO;
    let autenticatorService: AuthenticationService;
    let loginService: CpyLoginService;
    let router: Router;

    beforeEach(() => {
      autenticatorService = fixture.debugElement.injector.get(AuthenticationService);
      loginService = fixture.debugElement.injector.get(CpyLoginService);
      router = TestBed.get(Router);
      spyMail = spyOn(validatorService, 'isValidEmail').and.returnValue(true);
      spyPsw = spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      cpyDTO = new CompanyDTO();
      fixture.detectChanges();
    });
 
    it('should call onSubmitLoginForm if the button is pressed', () => {
     spyOn(component, 'onSubmitLoginForm');
     const loginButton: HTMLButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
     spyOn(router, 'navigate');
     loginButton.click();

     expect(component.onSubmitLoginForm).toHaveBeenCalled();
    });

    it('should call navigate for "company/cpyDashboard" if onSubmitLoginForm is called with correct values and not first login ', () => {
      cpyDTO.status = "OK";
      cpyDTO.cpyContractChecked = "true";
      let spy = spyOn(loginService, 'authLoginCpy').and.returnValue(of(cpyDTO));
      spyOn(router, 'navigate');
      component.onSubmitLoginForm();

      expect(router.navigate).toHaveBeenCalledWith(['company/cpyDashboard']);
    });

    it('should call navigate for "company/cpyUploadCtr" if onSubmitLoginForm is called with correct values and first login ', () => {
      cpyDTO.status = "OK";
      cpyDTO.cpyContractChecked = "false";
      let spy = spyOn(loginService, 'authLoginCpy').and.returnValue(of(cpyDTO));
      spyOn(router, 'navigate');
      component.onSubmitLoginForm();

      expect(router.navigate).toHaveBeenCalledWith(['company/cpyUploadCtr']);
    });

    it('should display generic error if response is negative', () => {
      cpyDTO.status = "KO";
      let spy = spyOn(loginService, 'authLoginCpy').and.returnValue(of(cpyDTO));
      component.onSubmitLoginForm();
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#cpy-login-error-description-generic'));

      expect(component.errorGeneric).toBeTrue();
      expect(element).toBeTruthy();
    });

    it('should display login fail if credentials are wrong', () => {
      cpyDTO.status = "KO";
      cpyDTO.errorDescription = myMessages.noUserFound;
      let spy = spyOn(loginService, 'authLoginCpy').and.returnValue(of(cpyDTO));
      component.onSubmitLoginForm();
      fixture.detectChanges();
      let element = fixture.debugElement.query(By.css('#cpy-login-error-description'));

      expect(component.loginFail).toBeTrue();
      expect(element).toBeTruthy();
    });

    it('should display the correct message if an error occurs', () => {
      let spy = spyOn(loginService, 'authLoginCpy').and.returnValue(throwError({status: 404}));
      component.onSubmitLoginForm();
      translate.updateTranslation();
      let element = fixture.debugElement.query(By.css('#cpy-login-error-description-generic'));
      expect(element.nativeElement.innerText).toEqual(translate.IT.ERRORS.GENERIC);
    });

  });

});
