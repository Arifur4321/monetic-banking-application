import { ComponentFixture, TestBed, getTestBed, waitForAsync } from '@angular/core/testing';

import { CpySignupComponent } from './cpy-signup.component';

import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

//Utility
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';
import { imports, Helper } from 'src/test-utility/test-utilities';

//Models 
import { CompanyDTO } from 'src/app/model/company-dto';
import { CpySignupService } from '../../services/rest/cpy-signup.service';
import { of } from 'rxjs/internal/observable/of';

import * as myMessages from 'src/globals/messages';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CpySignupComponent', () => {
  let component: CpySignupComponent;
  let fixture: ComponentFixture<CpySignupComponent>;
  let router: Router;
  let translate: TranslateTestingUtility<CpySignupComponent>;
  let cpySignupService: CpySignupService;
  let helper: Helper;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CpySignupComponent],
      imports:
        [imports,
          FormsModule
        ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpySignupComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    translate = new TranslateTestingUtility(fixture, getTestBed());
    helper = new Helper();
    cpySignupService = fixture.debugElement.injector.get(CpySignupService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validation check', () => {
    describe('checkFiscale()', () => {

      it('flag attribute should be true if code is valid', () => {
        component.cFiscale = 'dsncld93l46h501r';
        component.checkCFiscale();
        expect(component.cFiscaleOk).toBeTruthy();
      });

      it('flag attribute should be false if code is empty', () => {
        component.cFiscale = '';
        component.checkCFiscale();
        expect(component.cFiscaleOk).toBeFalsy();
      });

      it('flag attribute should be false if code is undefined', () => {
        component.cFiscale;
        component.checkCFiscale();
        expect(component.cFiscaleOk).toBeFalsy();
      });

      it('flag attribute should be false if code is shorter than expected', () => {
        component.cFiscale = 'dsn93l46h501r';
        component.checkCFiscale();
        expect(component.cFiscaleOk).toBeFalsy();
      });

      it('flag attribute should be false if code is longer than expected', () => {
        component.cFiscale = 'dsncld93l46h501rr';
        component.checkCFiscale();
        expect(component.cFiscaleOk).toBeFalsy();
      });

      it('flag attribute should be false if code have less letters than expected', () => {
        component.cFiscale = '0sncld93l46h501r';
        component.checkCFiscale();
        expect(component.cFiscaleOk).toBeFalsy();
      });

      it('flag attribute should be false if code have numbers in place of letters', () => {
        component.cFiscale = 'dsn93cldl46h501r';
        component.checkCFiscale();
        expect(component.cFiscaleOk).toBeFalsy();
      });

      it('flag attribute should be false if code don\'t end with valid control character ', () => {
        component.cFiscale = 'dsncld93l46h501i';
        component.checkCFiscale();
        expect(component.cFiscaleOk).toBeFalsy();
      });
    });

    describe('checkFirstName()', () => {
      it('flag attribute should be true if name is not empty', () => {
        component.firstNameRef = 'firstname';
        component.checkFirstNameRef();
        expect(component.firstNameRefOk).toBeTruthy();
      });

      it('flag attribute should be false if name is empty', () => {
        component.firstNameRef = '';
        component.checkFirstNameRef();
        expect(component.firstNameRefOk).toBeFalsy();
      });

      it('flag attribute should be false if name is undefined', () => {
        component.firstNameRef;
        component.checkFirstNameRef();
        expect(component.firstNameRefOk).toBeFalsy();
      });
    });

    describe('checkLastName', () => {
      it('flag attribute should be true if name is not empty', () => {
        component.lastNameRef = 'last name';
        component.checkLastNameRef();
        expect(component.lastNameRefOk).toBeTruthy();
      });

      it('flag attribute should be false if name is empty', () => {
        component.lastNameRef = '';
        component.checkLastNameRef();
        expect(component.lastNameRefOk).toBeFalsy();
      });

      it('flag attribute should be false if name is undefined', () => {
        component.lastNameRef;
        component.checkLastNameRef();
        expect(component.lastNameRefOk).toBeFalsy();
      });
    });

    describe('checkPhone', () => {
      it('flag attribute should be true if phone is not empty', () => {
        component.phoneRef = '012345678';
        component.checkPhoneRef();
        expect(component.phoneRefOk).toBeTruthy();
      });

      it('flag attribute should be false if phone contains letters', () => {
        component.phoneRef = 'abcdefgh123';
        component.checkPhoneRef();
        expect(component.phoneRefOk).toBeFalsy();
      });

      it('flag attribute should be false if phone is empty', () => {
        component.phoneRef = '';
        component.checkPhoneRef();
        expect(component.phoneRefOk).toBeFalsy();
      });

      it('flag attribute should be false if phone is undefined', () => {
        component.phoneRef;
        component.checkPhoneRef();
        expect(component.phoneRefOk).toBeFalsy();
      });
    });

    describe('checkRagSociale', () => {
      it('flag attribute should be true if ragSociale is not empty', () => {
        component.ragSociale = 'ragSociale';
        component.checkRagSociale();
        expect(component.ragSocialeOk).toBeTruthy();
      });

      it('flag attribute should be false if ragSociale is empty', () => {
        component.ragSociale = '';
        component.checkRagSociale();
        expect(component.ragSocialeOk).toBeFalsy();
      });

      it('flag attribute should be false if ragSociale is undefined', () => {
        component.ragSociale;
        component.checkRagSociale();
        expect(component.ragSocialeOk).toBeFalsy();
      });
    });

    describe('checkpIva', () => {
      it('flag attribute should be true if pIva is valid  ', () => {
        component.pIva = '07643520567';
        component.checkPIVA();
        expect(component.pIvaOk).toBeTruthy();
      });

      it('flag attribute should be false if pIva is empty', () => {
        component.pIva = '';
        component.checkPIVA();
        expect(component.pIvaOk).toBeFalsy();
      });

      it('flag attribute should be false if pIva is undefined', () => {
        component.pIva;
        component.checkPIVA();
        expect(component.pIvaOk).toBeFalsy();
      });

      it('flag attribute should be false if control character is wrong', () => {
        component.pIva = '07643520566';
        component.checkPIVA();
        expect(component.pIvaOk).toBeFalsy();
      });
    });
  });


  it('should create the right company (createCpyDTO)', () => {
    let companyDTOPreparato: CompanyDTO = new CompanyDTO();
    companyDTOPreparato.usrEmail = "mail@provider.it";
    component.email = "mail@provider.it"
    companyDTOPreparato.usrPassword = "Abcd1234";
    component.password = "Abcd1234";
    companyDTOPreparato.cpyPec = "mail@provider.it";
    component.pec = "mail@provider.it";
    companyDTOPreparato.cpyCodiceFiscale = "DSNCLD93L46H501R";
    component.cFiscale = "DSNCLD93L46H501R";
    companyDTOPreparato.cpyPartitaIva = '07643520567';
    component.pIva = '07643520567';
    companyDTOPreparato.cpyFirstNameRef = "ProvaNome";
    component.firstNameRef = "ProvaNome";
    companyDTOPreparato.cpyLastNameRef = "ProvaCognome";
    component.lastNameRef = "ProvaCognome";
    companyDTOPreparato.cpyPhoneNoRef = "123456789";
    component.phoneRef = "123456789";
    companyDTOPreparato.cpyCuu = "00125a";
    component.cuu = "00125a";
    companyDTOPreparato.cpyRagioneSociale = "ProvaRagione";
    component.ragSociale = "ProvaRagione";
    companyDTOPreparato.cpyAddress = "via prova, 23";
    component.address = "via prova, 23";
    companyDTOPreparato.cpyCity = "Roma";
    component.citySelect = "Roma";
    companyDTOPreparato.cpyProv = "RM";
    component.provSelect = "Roma, RM";
    companyDTOPreparato.cpyZip = "00100";
    component.cap = "00100";

    expect(component.createCpyDTO()).toEqual(companyDTOPreparato);
  });


  it('should call onFormSubmit if the signup button is pressed', () => {
    spyOn(component, 'onFormSubmit');
    translate.updateTranslation();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    let signupButton: HTMLButtonElement = helper.findButtonByText(buttons, translate.IT.SIGNUP.SIGNUP_LABEL);
    spyOn(router, 'navigate');
    signupButton.click();

    expect(component.onFormSubmit).toHaveBeenCalled();
  });

  describe('onFormSubmit', () => {
    let tab: HTMLElement;
    let spyCheck;
    let cpyDto: CompanyDTO;
    let spyDTO;
    let spyService;

    beforeEach(() => {
      translate.updateTranslation();
      cpyDto = new CompanyDTO();
      tab = fixture.debugElement.query(By.css('#cpy-signup-nav-contacts')).nativeElement;
      tab.setAttribute('class', 'active');
      spyCheck = spyOn(component, 'checkForm').and.returnValue(true);
      spyDTO = spyOn(component, 'createCpyDTO').and.returnValue(cpyDto);
      spyService = spyOn(cpySignupService, 'companySignup').and.returnValue(of(cpyDto))
      fixture.detectChanges();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('signupOk should be true', () => {
      cpyDto.status = 'OK';
      component.onFormSubmit();

      expect(component.signupOk).toBeTruthy();
    });

    it('if status is ok message body should be correct', () => {
      cpyDto.status = 'OK';
      let element = fixture.debugElement.query(By.css('#cpy-signup-modal-confirm-body'));
      component.onFormSubmit();
      fixture.detectChanges();
      let text = element.query(By.css('p')).nativeElement.innerText;

      expect(text).toEqual((translate.IT.SIGNUP.MODAL.RESPONSE_BODY_OK).replace(/ <br>/g, "\n"));
    });

    it('if status is ok login button should be enabled and with correct text', () => {
      cpyDto.status = 'OK';
      let button: HTMLButtonElement = fixture.debugElement.query(By.css('#cpy-signup-modal-confirm-footer-button')).nativeElement;
      component.onFormSubmit();
      fixture.detectChanges();

      expect(button.innerText).toEqual(translate.IT.SIGNUP.MODAL.GO_LOGIN);
      expect(button).not.toHaveClass('disabled');
    });

    it('if email already exist message body should be correct', () => {
      cpyDto.status = 'KO';
      cpyDto.errorDescription = myMessages.emailAlreadyExist;
      let element = fixture.debugElement.query(By.css('#cpy-signup-modal-confirm-body'));
      component.onFormSubmit();
      fixture.detectChanges();
      let text = element.query(By.css('p')).nativeElement.innerText;

      expect(text).toEqual((translate.IT.ERRORS.EMAIL_ALREADY_EXIST).replace(/ <br>/g, "\n"));
    });

    it('if email already exist button should be enabled and with correct text', () => {
      cpyDto.status = 'KO';
      cpyDto.errorDescription = myMessages.emailAlreadyExist;
      let button: HTMLButtonElement = fixture.debugElement.query(By.css('#cpy-signup-modal-confirm-footer-button')).nativeElement;
      component.onFormSubmit();
      fixture.detectChanges();

      expect(button.innerText).toEqual(translate.IT.SIGNUP.MODAL.RETRY);
      expect(button).not.toHaveClass('disabled');
    });

    it('if status is not ok and mail doesn\'t exist message body should be correct', () => {
      cpyDto.status = 'KO';
      let element = fixture.debugElement.query(By.css('#cpy-signup-modal-confirm-body'));
      component.onFormSubmit();
      fixture.detectChanges();
      let text = element.query(By.css('p')).nativeElement.innerText;

      expect(text).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it('if status is not ok and mail doesn\'t exist button should be enabled and with correct text', () => {
      cpyDto.status = 'KO';
      let button: HTMLButtonElement = fixture.debugElement.query(By.css('#cpy-signup-modal-confirm-footer-button')).nativeElement;
      component.onFormSubmit();
      fixture.detectChanges();

      expect(button.innerText).toEqual(translate.IT.SIGNUP.MODAL.RETRY);
      expect(button).not.toHaveClass('disabled');
    });

    it('should call forward tab if tab is not active', () => {
      tab.setAttribute('class', '');
      let spy = spyOn(component, 'goForwardTab');
      component.onFormSubmit();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    })

  });

  it('should call navigate for "company/cpyLogin" if confirmation is successful (goLogin)', () => {
    component.signupOk = true;
    spyOn(router, 'navigate');
    component.goLogin();

    expect(router.navigate).toHaveBeenCalledWith(['company/cpyLogin']);
  });

  describe(' goForwardTab', () => {
    let tab1 : HTMLElement ;
    let tabPage1 : HTMLElement;
    let tab2 : HTMLElement;
    let tabPage2 : HTMLElement;
    let tab3 : HTMLElement;
    let tabPage3 : HTMLElement;

    beforeEach(() =>{
      tab1 = fixture.debugElement.query(By.css('#cpy-signup-nav-auth-tab')).nativeElement;
      tabPage1 = fixture.debugElement.query(By.css('#cpy-signup-nav-auth')).nativeElement;
      tab2 = fixture.debugElement.query(By.css('#cpy-signup-nav-company-tab')).nativeElement;
      tabPage2 = fixture.debugElement.query(By.css('#cpy-signup-nav-company')).nativeElement;
      tab3 = fixture.debugElement.query(By.css('#cpy-signup-nav-referent-tab')).nativeElement;
      tabPage3 = fixture.debugElement.query(By.css('#cpy-signup-nav-referent')).nativeElement;
      tab1.classList.remove('active');
      tabPage1.classList.remove('active');
      tab2.classList.remove('active');
      tabPage2.classList.remove('active');
      tab3.classList.remove('active');
      tabPage3.classList.remove('active');
    })

    it('first tab', () => {
      tabPage1.classList.add('active');
      spyOn(component, 'checkEmail');
      spyOn(component, 'checkPassword');
      spyOn(component, 'checkPasswordRetype');
      component.emailOk = true;
      component.passwordOk= true;
      component.passwordRetypeOk = true;
      component.goForwardTab();
      fixture.detectChanges();
      expect(tab1.style.color).toBe('rgb(15, 185, 74)');

    });

    it('second tab', () => {                                     
      tabPage2.classList.add('active');
      spyOn(component, 'checkPec');
      spyOn(component, 'checkCuu');
      spyOn(component, 'checkPIVA');
      spyOn(component, 'checkCFiscale');
      spyOn(component, 'checkRagSociale');

      component.pecOk = true;
      component.cuuOk = true;
      component.pIvaOk = true;
      component.cFiscaleOk = true;
      component.ragSocialeOk = true;

      component.goForwardTab();
      fixture.detectChanges();
      expect(tab2.style.color).toBe('rgb(15, 185, 74)');
    });

    it('third tab', () => {
      tabPage3.classList.add('active');
      spyOn(component, 'checkFirstNameRef');
      spyOn(component, 'checkLastNameRef');
      spyOn(component, 'checkPhoneRef');

      component.firstNameRefOk = true;
      component.lastNameRefOk = true;
      component.phoneRefOk = true;

      component.goForwardTab();
      fixture.detectChanges();
      expect(tab3.style.color).toBe('rgb(15, 185, 74)');
    });

    
  });


  it('should hide modal if signup is not ok (goLogin)', () => {
    component.signupOk = false;
    component.goLogin();
    let modal = fixture.debugElement.query(By.css('#cpy-signup-modal-confirm')).nativeElement;

    expect(modal).not.toHaveClass('show');
  });



});
