import { ComponentFixture, TestBed, tick, getTestBed, waitForAsync } from '@angular/core/testing';

import { MrcSignupComponent } from './mrc-signup.component';
import { imports } from 'src/test-utility/test-utilities';
import { By } from '@angular/platform-browser';
import { GeographicService } from 'src/app/services/rest/geographic.service';
import { ProvinceDto } from 'src/app/model/province-dto';
import { Router } from '@angular/router';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { TranslateTestingUtility } from 'src/test-utility/translate-testing-utility';
import { MrcSignupService } from '../../services/rest/mrc-signup.service';
import * as myMessages from 'src/globals/messages';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

//JQuery
declare var $: any;

describe('MrcSignupComponent', () => {
  let component: MrcSignupComponent;
  let fixture: ComponentFixture<MrcSignupComponent>;
  let translate: TranslateTestingUtility<MrcSignupComponent>;
  let mrcSignupService: MrcSignupService;
  let setAll = (flag: boolean) => {
    component.emailOkButton = flag;
    component.passwordOkButton = flag;
    component.passwordRetypeOkButton = flag;
    component.pIvaOkButton = flag;
    component.codFisOkButton = flag;
    component.ragSocialeOkButton = flag;
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MrcSignupComponent],
      imports: [imports],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MrcSignupComponent);
    component = fixture.componentInstance;
    translate = new TranslateTestingUtility(fixture, getTestBed());
    mrcSignupService = fixture.debugElement.injector.get(MrcSignupService);
    fixture.detectChanges();
  });

  describe('initializing component and attributes...', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('FIRST TAB, controll validation email,password,passwordRepite,IVA,codice fiscale,ragione sociale,', () => {
    //% controllo email
    it('the attribute emailOk should be true with valid email jhonny345@gmail.com!', () => {
      component.email = 'jhonny.345@gmail.com';
      component.checkEmail();
      expect(component.emailOk).toBeTrue();
    });

    it('the attribute emailOkButton should be true with valid email jhonny345@gmail.com!', () => {
      component.email = 'jhonny345@gmail.com';
      component.checkEmail();
      expect(component.emailOkButton).toBeTrue();
    });

    it('the attribute emailOk should be false with invalid email jenji87.@gmail.com!', () => {
      component.email = 'jenji87.@gmail.com';
      component.checkEmail();
      expect(component.emailOk).toBeFalse();
    });

    it('the attribute emailOkButton should be false with invalid email jenji87.@gmail.com!', () => {
      component.email = 'jenji87.@gmail.com';
      component.checkEmail();
      expect(component.emailOkButton).toBeFalse();
    });
    //% controllo password
    it('the attribute passwordOk should be true with valid password dfrdrex4S!', () => {
      component.password = 'dfrdrex4S';
      component.checkPassword();
      expect(component.passwordOk).toBeTrue();
    });

    it('the attribute passwordOkButton should be true with valid password dfrdrex4S!', () => {
      component.password = 'dfrdrex4S';
      component.checkPassword();
      expect(component.passwordOkButton).toBeTrue();
    });

    it('the attribute passwordOk should be false with invalid password 4r45rd!', () => {
      component.password = '4r45rd';
      component.checkPassword();
      expect(component.passwordOk).toBeFalse();
    });

    it('the attribute passwordOkButton should be false with invalid password 4r45rd!', () => {
      component.password = '4r45rd';
      component.checkPassword();
      expect(component.passwordOkButton).toBeFalse();
    });
    //% controllo password ripetuta
    it('the attribute passwordRetypeOk should be true with valid same password dfrdrex4S!', () => {
      component.password = 'dfrdrex4S';
      component.passwordRetype = 'dfrdrex4S';
      component.checkPasswordRetype();
      expect(component.passwordRetypeOk).toBeTrue();
    });

    it('the attribute passwordRetypeOkButton should be true  with valid same password dfrdrex4S!', () => {
      component.password = 'dfrdrex4S';
      component.passwordRetype = 'dfrdrex4S';
      component.checkPasswordRetype();
      expect(component.passwordRetypeOkButton).toBeTrue();
    });

    it('the attribute passwordRetypeOk should be false with wrong password repeated dfrdrex4S!', () => {
      component.password = 'dfrdrex4S';
      component.passwordRetype = 'dfrdrex4';
      component.checkPasswordRetype();
      expect(component.passwordRetypeOk).toBeFalse();
    });

    it('the attribute passwordRetypeOkButton should be false with wrong password repeated dfrdrex4S!', () => {
      component.password = 'dfrdrex4S';
      component.passwordRetype = 'dfrdrex4';
      component.checkPasswordRetype();
      expect(component.passwordRetypeOkButton).toBeFalse();
    });
    //% controllo  codice IVA
    it('the attribute pIvaOk should be true w90874590475 VAT code!', () => {
      component.pIva = '90874590475';
      component.checkPIVA();
      expect(component.pIvaOk).toBeTrue();
    });

    it('the attribute pIvaOkButton should be true with valid 90874590475 VAT code!', () => {
      component.pIva = '90874590475';
      component.checkPIVA();
      expect(component.pIvaOkButton).toBeTrue();
    });

    it('the attribute pIvaOk should be false with invalid 076435205674 VAT code!', () => {
      component.pIva = '076435205674';
      component.checkPIVA();
      expect(component.pIvaOk).toBeFalse();
    });

    it('the attribute pIvaOkButton should be false with invalid 076435205674 VAT code!', () => {
      component.pIva = '076435205674';
      component.checkPIVA();
      expect(component.pIvaOkButton).toBeFalse();
    });
    //% controllo codice fiscale
    it('the attribute codFisOk should be true with valid dsncld93l46h501r fiscal code!', () => {
      component.codFis = 'dsncld93l46h501r';
      component.checkCodFis();
      expect(component.codFisOk).toBeTrue();
    });

    it('the attribute codFisOkButton should be true with valid dsncld93l46h501r fiscal code!', () => {
      component.codFis = 'dsncld93l46h501r';
      component.checkCodFis();
      expect(component.codFisOkButton).toBeTrue();
    });

    it('the attribute codFisOk should be false with invalid dsn93l46h501r fiscal code!', () => {
      component.codFis = 'dsn93l46h501r';
      component.checkCodFis();
      expect(component.codFisOk).toBeFalse();
    });

    it('the attribute codFisOkButton should be false with invalid dsn93l46h501r fiscal code!', () => {
      component.codFis = 'dsn93l46h501r';
      component.checkCodFis();
      expect(component.codFisOkButton).toBeFalse();
    });
    //% controllo ragione sociale
    it('the attribute ragSocialeOk should be true with valid cecchini business name!', () => {
      component.ragSociale = 'cecchini';
      component.checkRagSociale();
      expect(component.ragSocialeOk).toBeTrue();
    });

    it('the attribute ragSocialeOkButton should be true with valid cecchini business name!', () => {
      component.ragSociale = 'cecchini';
      component.checkRagSociale();
      expect(component.ragSocialeOkButton).toBeTrue();
    });

    it('the attribute ragSocialeOk should be false with empty business name!', () => {
      component.ragSociale = ' ';
      component.checkRagSociale();
      expect(component.ragSocialeOk).toBeFalse();
    });

    it('the attribute ragSocialeOkButton should be false with invalid empty business name!', () => {
      component.ragSociale = ' ';
      component.checkRagSociale();
      expect(component.ragSocialeOkButton).toBeFalse();
    });
  });

  describe('onInputFieldsProfile points of view', () => {
    it('the element with #mrc-signup-button-profile Id, should contain the .btn-primary class!', () => {
      setAll(true);
      component.onInputFieldsProfile();
      fixture.detectChanges();
      let button_Avanti_177_row = fixture.debugElement.query((de) => {
        return de.nativeElement.id === 'mrc-signup-button-profile';
      });
      expect(button_Avanti_177_row.nativeElement).toHaveClass('btn-primary');
    });

    it('the element with #mrc-signup-button-profile Id,it not should contain the .btn-primary class!', () => {
      setAll(false);
      component.onInputFieldsProfile();
      fixture.detectChanges();
      let button_Avanti_177_row = fixture.debugElement.query((de) => {
        return de.nativeElement.id === 'mrc-signup-button-profile';
      });
      expect(button_Avanti_177_row.nativeElement).not.toHaveClass(
        'btn-primary'
      );
    });
  });
  //% controllo secondo tab
  describe('SECOND TAB, controll address,province,city,CAP,phone', () => {
    let geographicService: GeographicService;
    let provinceDtoFake: ProvinceDto[];
    let riempiConProvinceFake = () => {
      let castello = new ProvinceDto();
      castello.name = 'Castello';
      castello.cod = 'C';
      let arezzo = new ProvinceDto();
      arezzo.name = 'Arezzo';
      arezzo.cod = 'AR';
      let bari = new ProvinceDto();
      bari.name = 'Bari';
      bari.cod = 'BA';
      let bergamo = new ProvinceDto();
      bergamo.name = 'Bergamo';
      bergamo.cod = 'BG';
      provinceDtoFake = [castello];
      provinceDtoFake.push(arezzo);
      provinceDtoFake.push(bari);
      provinceDtoFake.push(bergamo);
    };
    beforeEach(() => {
      geographicService = fixture.debugElement.injector.get(GeographicService);
      fixture.detectChanges();
    });

    it('the attribute addressOk should be true, with valid address!', () => {
      component.address = 'Via Paolo secondo';
      component.checkAddress();
      expect(component.addressOk).toBeTrue();
    });

    it('the attributeaddressOkButton should be true, with valid address!', () => {
      component.address = 'Via Paolo secondo';
      component.checkAddress();
      expect(component.addressOkButton).toBeTrue();
    });

    it('the attribute addressOk should be false, with empty address!', () => {
      component.address = ' ';
      component.checkAddress();
      expect(component.addressOk).toBeFalse();
    });

    it('the attributeaddressOkButton should be false, with empty address!', () => {
      component.address = ' ';
      component.checkAddress();
      expect(component.addressOkButton).toBeFalse();
    });

    //% controllo provincia

    it('the attribute provOk should be true!', () => {
      component.provOk = false; //4 provincie
      riempiConProvinceFake();
      component.provinces = provinceDtoFake;
      fixture.detectChanges();
      component.checkProv();
      expect(component.provinces.length).toEqual(4);
      expect($('#provinces').children().length).toEqual(5);
    });

    it('the attribute provOkButton should be true!', () => {
      riempiConProvinceFake(); //4 provincie
      component.provinces = provinceDtoFake;
      fixture.detectChanges();
      component.checkProv();
      expect(component.provinces.length).toEqual(4);
      expect($('#provinces').children().length).toEqual(5);
    });

    it('the sub elements of datalist should be 1 if are not provinces!', () => {
      expect($('#provinces').has('option').length).toEqual(1);
    });

    it('the sub elements of datalist should be 5 if there are provinces!', () => {
      riempiConProvinceFake(); //4 provincie
      component.provinces = provinceDtoFake;
      fixture.detectChanges();
      expect(component.provinces.length).toEqual(4);
      expect($('#provinces').children().length).toEqual(5);
    });



    //% controllo CAP
    it('the attribute capOk should be true!', () => {
      component.cap = '00021';
      component.checkCap();
      expect(component.capOk).toBeTrue();
    });

    it('the attribute capOkButton should be true!', () => {
      component.cap = '00021';
      component.checkCap();
      expect(component.capOkButton).toBeTrue();
    });

    it('the attribute capOk should be false!', () => {
      component.cap = '00';
      component.checkCap();
      expect(component.capOk).toBeFalse();
    });

    it('the attribute capOkButton should be false!', () => {
      component.cap = '00';
      component.checkCap();
      expect(component.capOkButton).toBeFalse();
    });

    //% controllo phone
    it('the attribute telephoneOk should be true!', () => {
      component.telephone = '4357894353';
      component.checkPhone();
      expect(component.telephoneOk).toBeTrue();
    });

    it('the attribute telephoneOkButton should be true!', () => {
      component.telephone = '4357894353';
      component.checkPhone();
      expect(component.telephoneOkButton).toBeTrue();
    });

    it('the phone number empty should be invalid!!', () => {
      component.telephone = '';
      component.checkPhone();
      expect(component.telephoneOk).toBeFalse();
      expect(component.telephoneOkButton).toBeFalse();
    });

  });

  it('should create the right merchant (createùMrcDTO)', () => {
    let merchantDTOPreparato: MerchantDTO = new MerchantDTO();
    merchantDTOPreparato.usrEmail = 'mail@provider.it';
    component.email = 'mail@provider.it';
    merchantDTOPreparato.usrPassword = 'Abcd1234';
    component.password = 'Abcd1234';
    merchantDTOPreparato.mrcCodiceFiscale = 'DSNCLD93L46H501R';
    component.codFis = 'DSNCLD93L46H501R';
    merchantDTOPreparato.mrcPartitaIva = '07643520567';
    component.pIva = '07643520567';
    merchantDTOPreparato.mrcFirstNameRef = 'ProvaNome';
    component.firstNameRef = 'ProvaNome';
    merchantDTOPreparato.mrcLastNameRef = 'ProvaCognome';
    component.lastNameRef = 'ProvaCognome';
    merchantDTOPreparato.mrcPhoneNo = '123456789';
    component.telephone = '123456789';
    merchantDTOPreparato.mrcRagioneSociale = 'ProvaRagione';
    component.ragSociale = 'ProvaRagione';
    merchantDTOPreparato.mrcAddress = 'via prova, 23';
    component.address = 'via prova, 23';
    merchantDTOPreparato.mrcCity = 'Roma';
    component.city = 'Roma';
    merchantDTOPreparato.mrcProv = 'RM';
    component.province = 'Roma, RM';
    merchantDTOPreparato.mrcZip = '00100';
    component.cap = '00100';
    merchantDTOPreparato.mrcFirstNameReq = 'NomeProva';
    component.firstNameReq = 'NomeProva';
    merchantDTOPreparato.mrcLastNameReq = 'CognomeProva';
    component.lastNameReq = 'CognomeProva';
    merchantDTOPreparato.mrcRoleReq = 'Amministratore';
    component.roleReq = 'Amministratore';
    merchantDTOPreparato.mrcOfficeName = 'NomeUfficio';
    component.officeName = 'NomeUfficio';
    merchantDTOPreparato.mrcAddressOffice = 'Via Milano, 25';
    component.addressOffice = 'Via Milano, 25';
    merchantDTOPreparato.mrcProvOffice = 'RM';
    component.provOffice = 'Roma, RM';
    merchantDTOPreparato.mrcCityOffice = 'Roma';
    component.cityOffice = 'Roma';
    merchantDTOPreparato.mrcPhoneNoOffice = '987654321';
    component.phoneNoOffice = '987654321';
    merchantDTOPreparato.mrcIban = 'GB33BUKB20201555555555';
    component.iban = 'GB33BUKB20201555555555';
    merchantDTOPreparato.mrcBank = 'Banca del Sapone';
    component.bank = 'Banca del Sapone';
    expect(component.createMrcDTO()).toEqual(merchantDTOPreparato);
  });

  describe('onFormSubmit', () => {
    let spyCheck;
    let mrcDto: MerchantDTO;

    beforeEach(() => {
      translate.updateTranslation();
      mrcDto = new MerchantDTO();
      spyCheck = spyOn(component, 'checkForm').and.returnValue(true);
      spyOn(component, 'createMrcDTO').and.returnValue(mrcDto);
      spyOn(mrcSignupService, 'merchantSignup').and.returnValue(of(mrcDto));
      fixture.detectChanges();
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('signupOk should be true', () => {
      mrcDto.status = 'OK';
      component.onFormSubmit();
      expect(component.signupOk).toBeTruthy();
    });

    it('if status is ok message body should be correct', () => {
      mrcDto.status = 'OK';
      let element = fixture.debugElement.query(
        By.css('#mrc-signup-modal-confirm-body')
      );
      component.onFormSubmit();
      fixture.detectChanges();
      let text = element.query(By.css('p')).nativeElement.innerText;
      expect(text).toEqual(
        translate.IT.SIGNUP.MODAL.RESPONSE_BODY_EMP_OK.replace(/ <br>/g, '\n')
      );
    });

    it('if status is ok login button should be enabled and with correct text', () => {
      mrcDto.status = 'OK';
      let button: HTMLButtonElement = fixture.debugElement.query(
        By.css('#btn-modal-close')
      ).nativeElement;
      component.onFormSubmit();
      fixture.detectChanges();
      expect(button.innerText).toEqual(translate.IT.SIGNUP.MODAL.GO_LOGIN);
      expect(button).not.toHaveClass('disabled');
    });

    it('if email already exist message body should be correct', () => {
      mrcDto.status = 'KO';
      mrcDto.errorDescription = myMessages.emailAlreadyExist;
      let element = fixture.debugElement.query(
        By.css('#mrc-signup-modal-confirm-body')
      );
      component.onFormSubmit();
      fixture.detectChanges();
      let text = element.query(By.css('p')).nativeElement.innerText;

      expect(text).toEqual(
        translate.IT.ERRORS.EMAIL_ALREADY_EXIST.replace(/ <br>/g, '\n')
      );
    });

    it('if email already exist button should be enabled and with correct text', () => {
      mrcDto.status = 'KO';
      mrcDto.errorDescription = myMessages.emailAlreadyExist;
      let button: HTMLButtonElement = fixture.debugElement.query(
        By.css('#btn-modal-close')
      ).nativeElement;
      component.onFormSubmit();
      fixture.detectChanges();
      expect(button.innerText).toEqual(translate.IT.SIGNUP.MODAL.RETRY);
      expect(button).not.toHaveClass('disabled');
    });

    it("if status is not ok and mail doesn't exist message body should be correct", () => {
      mrcDto.status = 'KO';
      let element = fixture.debugElement.query(
        By.css('#mrc-signup-modal-confirm-body')
      );
      component.onFormSubmit();
      fixture.detectChanges();
      let text = element.query(By.css('p')).nativeElement.innerText;
      expect(text).toEqual(translate.IT.ERRORS.GENERIC);
    });

    it("if status is not ok and mail doesn't exist button should be enabled and with correct text", () => {
      mrcDto.status = 'KO';
      let button: HTMLButtonElement = fixture.debugElement.query(
        By.css('#btn-modal-close')
      ).nativeElement;
      component.onFormSubmit();
      fixture.detectChanges();
      expect(button.innerText).toEqual(translate.IT.SIGNUP.MODAL.RETRY);
      expect(button).not.toHaveClass('disabled');
    });
  });

  it('should call navigate for merchant login if confirmation is successful (goLogin)', () => {
    let router: Router = TestBed.inject(Router);
    component.signupOk = true;
    spyOn(router, 'navigate');
    component.goLogin();
    expect(router.navigate).toHaveBeenCalledWith(['merchant/mrcLogin']);
  });

  it('should hide modal if signup is not ok (goLogin)', () => {
    component.signupOk = false;
    component.goLogin();
    let modal = fixture.debugElement.query(By.css('#modalConfirmSignup'))
      .nativeElement;
    expect(modal).not.toHaveClass('show');
  });
});
