import { ComponentFixture, TestBed, fakeAsync, tick, getTestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
//class
import { MrcLoginComponent } from './mrc-login.component';
//utilities
import { imports } from 'src/test-utility/test-utilities';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';
//tools
import { throwError, of} from 'rxjs';
//models
import { MerchantDTO } from 'src/app/model/merchant-dto';
//services
import { MrcLoginService } from '../../services/rest/mrc-login.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

//navigation
import { Router } from '@angular/router';
//Components
import { MrcSignupComponent } from '../mrc-signup/mrc-signup.component';
import { MrcDashboardComponent } from '../mrc-dashboard/mrc-dashboard.component';


describe('MrcLoginComponent', () => {
  let component: MrcLoginComponent;
  let fixture: ComponentFixture<MrcLoginComponent>;
  let validatorService: ValidatorService;
  let translate: TranslateTestingUtility<MrcLoginComponent>;
  let loginService: MrcLoginService;



  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MrcLoginComponent],
      imports: [imports, FormsModule
      ],
    }).compileComponents();
  }));



  beforeEach(() => {
    fixture = TestBed.createComponent(MrcLoginComponent);
    component = fixture.componentInstance;
    translate = new TranslateTestingUtility(fixture, getTestBed());
    validatorService = fixture.debugElement.injector.get(ValidatorService);
    loginService = fixture.debugElement.injector.get(MrcLoginService);
    fixture.detectChanges();
  });

  describe('validation has effect', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    /*controllo email invalida*/
    it('it should set is-invalid class to input tag,if email is not correct!', () => {
      spyOn(validatorService, 'isValidEmail').and.returnValue(false);
      component.checkEmail();
      fixture.detectChanges();
      let inputEmail = fixture.debugElement.query((de) => {
        return de.nativeElement.name === 'email';
      });

      expect(inputEmail.nativeElement).toHaveClass('is-invalid');
    });
    /*controllo password invalida*/
    it('it should set is-invalid class to input tag,if password is not correct!', () => {
      spyOn(validatorService, 'isNotEmpty').and.returnValue(false);
      component.checkPassword();
      fixture.detectChanges();
      let inputPassword = fixture.debugElement.query((de) => {
        return de.nativeElement.name === 'password';
      });
      expect(inputPassword.nativeElement).toHaveClass('is-invalid');
    });
    /*controllo password valida*/
    it('it should set is-valid class to input tag,if password is correct!', () => {
      spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      component.checkPassword();
      fixture.detectChanges();

      let inputPassword = fixture.debugElement.query((de) => {
        return de.nativeElement.name === 'password';
      });

      expect(inputPassword.nativeElement).toHaveClass('is-valid');
    });
    /*controllo email valida*/
    it('it should set is-valid class to input tag,if email is correct!', () => {
      spyOn(validatorService, 'isValidEmail').and.returnValue(true);
      component.checkEmail();

      fixture.detectChanges();
      let inputEamil = fixture.debugElement.query((de) => {
        return de.nativeElement.name === 'email';
      });
      expect(inputEamil.nativeElement).toHaveClass('is-valid');
    });
    /*controllo allocazzione nome sul tasto submit*/
    it('the button should contain LOGIN.LOGIN_LABEL as text!', () => {
      translate.updateTranslation();
      const loginButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('button')
      ).nativeElement;

      expect(loginButton.innerText).toEqual(translate.IT.LOGIN.LOGIN_LABEL);
    });
    /*controllo messaggio di errore in caso di mancanza email e password*/
    it('should display the correct message if an error occurs', () => {
      spyOn(loginService, 'authLoginMrc').and.returnValue(
        throwError({ status: 404 })
      );
      spyOn(validatorService, 'isValidEmail').and.returnValue(true);
      spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      component.checkLoginFormMrc();
      translate.updateTranslation();
      let element = fixture.debugElement.query(
        By.css('#mrc-login-error-description-generic')
      );
      expect(element.nativeElement.innerText).toEqual(
        translate.IT.ERRORS.GENERIC
      );
    });
  });

  describe('checkLoginFormMrc()', () => {
    let spyMail;
    let spyPsw;
    let mrcDTO: MerchantDTO;
    let autenticatorService: AuthenticationService;
    let loginService: MrcLoginService;
    let router: Router;

    beforeEach(() => {
      autenticatorService = fixture.debugElement.injector.get(
        AuthenticationService
      );
      loginService = fixture.debugElement.injector.get(MrcLoginService);
      router = TestBed.get(Router);
      spyMail= spyOn(validatorService, 'isValidEmail').and.returnValue(true);
      spyPsw= spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      spyOn(autenticatorService, 'setUserSession');
      spyOn(autenticatorService, 'setEmailSession');
      spyOn(autenticatorService, 'setProfile');
      spyOn(autenticatorService, 'setSessionId');
      mrcDTO = new MerchantDTO();
      fixture.detectChanges();
    });
   
    /*controllo variabile in caso di errore generico*/
    it('it should be true errorGeneric if an error occurs!', () => {
      spyOn(loginService, 'authLoginMrc').and.returnValue(of(mrcDTO));
      component.checkLoginFormMrc();
      expect(component.errorGeneric).toBeTrue();
    });
    /*controllo variabile in caso di errore login*/
    it('it should be true loginFail if an error occurs!', () => {
      mrcDTO.errorDescription = 'no_user_found';
      spyOn(loginService, 'authLoginMrc').and.returnValue(of(mrcDTO));
      component.checkLoginFormMrc();
      expect(component.loginFail).toBeTrue();
    });
    /*controllo variabile in caso di errore */
    it('it should be true errorGeneric if an unknown error occurs!', () => {
      spyOn(loginService, 'authLoginMrc').and.returnValue(
        throwError({ status: 404 })
      );
      component.checkLoginFormMrc();
      expect(component.errorGeneric).toBeTrue();
    });
  });

  xdescribe('testing navigation', () => {
    let mrcDTO: MerchantDTO;
    let autenticatorService: AuthenticationService;
    let loginService: MrcLoginService;
    let router: Router;
    let location: Location;
    let fixtureMrcDashBoard: ComponentFixture<MrcDashboardComponent>;
    let fixtureMrcSignup: ComponentFixture<MrcSignupComponent>;

    beforeEach(() => {
      router = TestBed.get(Router);
      location = TestBed.get(Location);
      fixtureMrcDashBoard = TestBed.createComponent(MrcDashboardComponent);
      fixtureMrcSignup = TestBed.createComponent(MrcSignupComponent);
      router.initialNavigation();

      autenticatorService = fixture.debugElement.injector.get(
        AuthenticationService
      );
      loginService = fixture.debugElement.injector.get(MrcLoginService);

      spyOn(validatorService, 'isValidEmail').and.returnValue(true);
      spyOn(validatorService, 'isNotEmpty').and.returnValue(true);
      spyOn(autenticatorService, 'setUserSession');
      spyOn(autenticatorService, 'setEmailSession');
      spyOn(autenticatorService, 'setProfile');
      spyOn(autenticatorService, 'setSessionId');
      mrcDTO = new MerchantDTO();
      fixture.detectChanges();
    });

  });
});
