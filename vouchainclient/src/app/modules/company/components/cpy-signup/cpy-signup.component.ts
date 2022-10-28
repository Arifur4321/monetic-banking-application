/* --- DEFAULTS IMPORTS --- */
import { Component, OnDestroy, OnInit } from '@angular/core';

/* vvv CUSTOM IMPORTS vvv */
//#region

/* Custom Messages */
import * as myMessages from 'src/globals/messages';

/* FontAwesome */
import {
  faArrowLeft,
  faArrowRight,
  faExclamationCircle,
  faHome,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

/* jQuery */
declare var $: any;

/* Models */
import { CityDto } from 'src/app/model/city-dto';
import { CompanyDTO } from 'src/app/model/company-dto';
import { ProvinceDto } from 'src/app/model/province-dto';

/* Router */
import { Router } from '@angular/router';

/* Services */
import { CpySignupService } from '../../services/rest/cpy-signup.service';
import { GeographicService } from 'src/app/services/rest/geographic.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/services/validator.service';

import { environment } from 'src/environments/environment';

//#endregion
/* ^^^ CUSTOM IMPORTS ^^^ */

@Component({
  selector: 'app-cpy-signup',
  templateUrl: './cpy-signup.component.html',
  styleUrls: ['./cpy-signup.component.css'],
})
export class CpySignupComponent implements OnInit, OnDestroy {
  /* --- ATTRIBUTES --- */
  //#region

  /* FontAwesome Icons */
  fasArrowLeft = faArrowLeft;
  fasArrowRight = faArrowRight;
  fasExclamationCircle = faExclamationCircle;
  fasHome = faHome;
  fasInfoCircle = faInfoCircle;

  /* vvv FORM VALUES vvv */
  //#region

  /* Address */
  address: string;
  addressOk: boolean = true;

  /* ZIP Code */
  cap: string;
  capOk: boolean = true;

  /* Codice Fiscale */
  cFiscale: string;
  cFiscaleOk: boolean = true;

  /* City Selection */
  cityOk: boolean = true;
  citySelect: string = '';

  /* Codice Univoco */
  cuu: string;
  cuuOk: boolean = true;

  /* Email */
  email: string;
  emailOk: boolean = true;

  /* First & Last Name */
  firstNameRef: string;
  firstNameRefOk: boolean = true;
  lastNameRef: string;
  lastNameRefOk: boolean = true;

  /* Partita IVA */
  pIva: string;
  pIvaOk: boolean = true;

  /* Password */
  password: string;
  passwordOk: boolean = true;

  /* Retype Password */
  passwordRetype: string;
  passwordRetypeOk: boolean = true;

  /* PEC */
  pec: string;
  pecOk: boolean = true;

  /* Telephone */
  phoneRef: string;
  phoneRefOk: boolean = true;

  /* Province Selection */
  provSelect: string = '';

  /* Ragione Sociale */
  ragSociale: string;
  ragSocialeOk: boolean = true;

  /* Terms & Conditions */
  termsAndCondOk: boolean;

  //#endregion
  /* ^^^ FORM VALUES ^^^ */

  /* Messages */
  msgSignupBody: string;
  msgSignupBodyShow: boolean = false;
  msgSignupButton: string;

  /* Models */
  cities: CityDto[];
  cpyDTO: CompanyDTO;
  provinces: ProvinceDto[];

  /* Status */
  signupOk: boolean = false;

  homepage: string = environment.homeUrl;

  //#endregion
  /* ^^^ ATTRIBUTES ^^^ */

  constructor(
    private cpySignupService: CpySignupService,
    private geoService: GeographicService,
    private route: Router,
    private translatorService: TranslateService,
    private validatorService: ValidatorService
  ) {}

  ngOnInit(): void {
    /* Enable Bootstrap Tooltips */
    /* FIXME: Non sembra funzionare con ngx-translate.
       La causa sembra dovuta ad un ritardo nel riempire con le "traduzioni"
       Possibile soluzione: https://github.com/ngx-translate/core/issues/517#issuecomment-299637956
    */
    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });

    /* Hide Bootstrap Tooltips when switching between tabs */
    $('[data-toggle="tab"]').click(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  ngOnDestroy(): void {
    /* Hide Bootstrap Tooltips when switch component/page */
    $(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  /* vvv METHODS vvv */
  //#region

  /* Create a CompanyDTO Object using the form's inputs values */
  createCpyDTO() {
    let companyDTO: CompanyDTO = new CompanyDTO();

    companyDTO.usrEmail = this.email;
    companyDTO.usrPassword = this.password;
    companyDTO.cpyPec = this.pec;
    companyDTO.cpyCodiceFiscale = this.cFiscale;
    companyDTO.cpyPartitaIva = this.pIva;
    companyDTO.cpyFirstNameRef = this.firstNameRef;
    companyDTO.cpyLastNameRef = this.lastNameRef;
    companyDTO.cpyPhoneNoRef = this.phoneRef;
    companyDTO.cpyCuu = this.cuu;
    companyDTO.cpyRagioneSociale = this.ragSociale;
    companyDTO.cpyAddress = this.address;
    companyDTO.cpyCity = this.citySelect;
    companyDTO.cpyProv = this.provSelect.split(', ')[1];
    companyDTO.cpyZip = this.cap;

    return companyDTO;
  }

  /* Cities & Provinces Getters */
  getCitiesByProvince() {
    this.cities = this.geoService.getAllCitiesByProvince(
      this.provSelect.split(', ')[1]
    );
  }

  getProvinces() {
    this.provinces = this.geoService.getAllProvinces();
  }

  /* Submit Form */
  onFormSubmit() {
    /* Modals IDs */
    let modalSignupConfirmation = $('#cpy-signup-modal-confirm');
    let modalSignupConfirmationButton = $(
      '#cpy-signup-modal-confirm-footer-button'
    );

    /* Tabs IDs */
    let contactsTabPage = $('#cpy-signup-nav-contacts');

    /* 
          Handling when user press "Enter" key on a input.
          If he's on the last tab prepare for final validation checks,
          if it passes it'll proceed with the rest service, etc. 
          Else he'll go to the the next tab (method: goForwardTab()).
        */
    if (contactsTabPage.hasClass('active')) {
      /* Reset Modal to default state */
      modalSignupConfirmationButton.prop('disabled', true);
      $(
        '#cpy-signup-modal-confirm-footer-button span'
      ).show(); /* Unhide the loading icon */
      this.signupOk = false;
      this.msgSignupBodyShow = false;
      this.msgSignupButton = this.translatorService.instant(
        'SIGNUP.MODAL.LOADING_BUTTON'
      );

      if (this.checkForm()) {
        /* Show a 'static' Modal (user can't close it by clicking outside or pressing on the keyboard) */
        modalSignupConfirmation.modal({ backdrop: 'static', keyboard: false });
        modalSignupConfirmation.modal('show');

        this.cpySignupService.companySignup(this.createCpyDTO()).subscribe(
          (response) => {
            /* Assign the response DTO to an attribute DTO */
            this.cpyDTO = response;

            /* Check if registration is successful */
            if (this.cpyDTO.status === 'OK') {
              /* Show instructions for successful registration */
              this.signupOk = true;
              this.msgSignupBodyShow = true;
              this.msgSignupBody = this.translatorService.instant(
                'SIGNUP.MODAL.RESPONSE_BODY_OK'
              );
              this.msgSignupButton = this.translatorService.instant(
                'SIGNUP.MODAL.GO_LOGIN'
              );

              /* Hide loading icon and enable the 'Go to login' button */
              $('#cpy-signup-modal-confirm-footer-button span').hide();
              modalSignupConfirmationButton.removeAttr('disabled');
            } else if (
              this.cpyDTO.errorDescription === myMessages.emailAlreadyExist
            ) {
              /* Show error messages ('Email already exist') */
              this.msgSignupBodyShow = true;
              this.msgSignupBody = this.translatorService.instant(
                'ERRORS.EMAIL_ALREADY_EXIST'
              );
              this.msgSignupButton = this.translatorService.instant(
                'SIGNUP.MODAL.RETRY'
              );

              /* Hide loading icon and enable the 'Retry' button */
              $('#cpy-signup-modal-confirm-footer-button span').hide();
              modalSignupConfirmationButton.removeAttr('disabled');
            } else {
              /* Show error messages ('Generic Error') */
              this.msgSignupBodyShow = true;
              this.msgSignupBody = this.translatorService.instant(
                'ERRORS.GENERIC'
              );
              this.msgSignupButton = this.translatorService.instant(
                'SIGNUP.MODAL.RETRY'
              );

              /* Hide loading icon and enable the 'Retry' button */
              $('#cpy-signup-modal-confirm-footer-button span').hide();
              modalSignupConfirmationButton.removeAttr('disabled');
            }
          },
          () => {
            /* Show error messages ('Generic HTTP Error') */
            this.msgSignupBodyShow = true;
            this.msgSignupBody = this.translatorService.instant(
              'ERRORS.GENERIC'
            );
            this.msgSignupButton = this.translatorService.instant(
              'SIGNUP.MODAL.RETRY'
            );

            /* Hide loading icon and enable the 'Retry' button */
            $('#cpy-signup-modal-confirm-footer-button span').hide();
            modalSignupConfirmationButton.removeAttr('disabled');
          }
        );
      }
    } else {
      this.goForwardTab();
    }
  }

  /* vvv BUTTONS vvv */
  //#region

  goBackwardTab() {
    $('.nav-tabs > .active').prev('a').trigger('click');
  }

  goForwardTab() {
    let authTab = $('#cpy-signup-nav-auth-tab');
    let authTabPage = $('#cpy-signup-nav-auth');
    let companyTab = $('#cpy-signup-nav-company-tab');
    let companyTabPage = $('#cpy-signup-nav-company');
    let referentTab = $('#cpy-signup-nav-referent-tab');
    let referentTabPage = $('#cpy-signup-nav-referent');

    /* Check which tab is currently active */
    if (authTabPage.hasClass('active')) {
      /* Force check on all tab's inputs */
      this.checkEmail();
      this.checkPassword();
      this.checkPasswordRetype();

      /* If check pass: color current tab 'green', unlock and go to next tab  */
      if (this.emailOk && this.passwordOk && this.passwordRetypeOk) {
        authTab.css('color', '#0fb94a');
        $('.nav-tabs > .active')
          .next('a')
          .removeClass('disabled')
          .trigger('click');
      }
    } else if (companyTabPage.hasClass('active')) {
      this.checkPec();
      this.checkCuu();
      this.checkPIVA();
      this.checkCFiscale();
      this.checkRagSociale();

      if (
        this.pecOk &&
        this.cuuOk &&
        this.pIvaOk &&
        this.cFiscaleOk &&
        this.ragSocialeOk
      ) {
        companyTab.css('color', '#0fb94a');
        $('.nav-tabs > .active')
          .next('a')
          .removeClass('disabled')
          .trigger('click');
      }
    } else if (referentTabPage.hasClass('active')) {
      this.checkFirstNameRef();
      this.checkLastNameRef();
      this.checkPhoneRef();

      if (this.firstNameRefOk && this.lastNameRefOk && this.phoneRefOk) {
        referentTab.css('color', '#0fb94a');
        $('.nav-tabs > .active')
          .next('a')
          .removeClass('disabled')
          .trigger('click');
      }
    }
  }

  goLogin() {
    let modalSignupConfirmation = $('#cpy-signup-modal-confirm');

    /* Check whether signup went okay or not */
    if (this.signupOk) {
      /* Hide modal before going to login page */
      modalSignupConfirmation.modal('hide');

      this.route.navigate(['company/cpyLogin']);
    } else {
      modalSignupConfirmation.modal('hide');
    }
  }

  //#endregion
  /* ^^^ BUTTONS ^^^ */

  /* vvv VALIDATIONS vvv */
  //#region

  /* Toggle Authentication Tab Page Forward Button */
  checkAuthTab(): boolean {
    return !(
      this.email &&
      this.emailOk &&
      this.password &&
      this.passwordOk &&
      this.passwordRetype &&
      this.passwordRetypeOk
    );
  }

  checkCap() {
    this.capOk = this.validatorService.isValidCap(this.cap);
  }

  /* Just check if the value is not empty */
  checkCFiscale() {
    /* Force Cod.Fiscale without whitespaces */
    this.cFiscale = this.cFiscale.replace(/\s/g, '');
    $('input[name="cFiscale"]').val(this.cFiscale); // Always reflect change on input value

    this.cFiscaleOk = this.validatorService.isValidCFiscale(this.cFiscale);
  }

  /* Toggle Company Tab Page Forward Button */
  checkCompanyTab(): boolean {
    return !(
      this.pec &&
      this.pecOk &&
      this.pIva &&
      this.pIvaOk &&
      this.cFiscale &&
      this.cFiscaleOk &&
      this.ragSociale &&
      this.ragSocialeOk &&
      this.cuu &&
      this.cuuOk
    );
  }

  checkCuu() {
    this.cuuOk = this.validatorService.isValidCuu(this.cuu);
  }

  checkEmail() {
    this.emailOk = this.validatorService.isValidEmail(this.email);
  }

  /* Just check if the value is not empty */
  checkFirstNameRef() {
    this.firstNameRefOk = this.validatorService.isNotEmpty(this.firstNameRef);
  }

  checkForm(): boolean {
    /* Tabs IDs */
    let authTab = $('#cpy-signup-nav-auth-tab');
    let companyTab = $('#cpy-signup-nav-company-tab');
    let referentTab = $('#cpy-signup-nav-referent-tab');

    /* Checkbox ID */
    let tndcCheckbox = $('#cpy-singup-tndc-checkbox');

    /* Validate Authorization tab inputs */
    this.checkEmail();
    this.checkPassword();
    this.checkPasswordRetype();

    /* Validate Company tab inputs */
    this.checkPec();
    this.checkPIVA();
    this.checkCFiscale();
    this.checkRagSociale();
    this.checkCuu();

    /* Validate Reference tab inputs */
    this.checkFirstNameRef();
    this.checkLastNameRef();
    this.checkPhoneRef();

    /* If validation doesn't pass for one or more inputs, switch to the relative tab */
    if (!this.emailOk || !this.passwordOk || !this.passwordRetypeOk) {
      /* Switch to Authorization tab */
      authTab.tab('show');
    } else if (
      !this.pecOk ||
      !this.cuuOk ||
      !this.pIvaOk ||
      !this.cFiscaleOk ||
      !this.ragSocialeOk
    ) {
      /* Switch to Company tab */
      companyTab.tab('show');
    } else if (
      !this.firstNameRefOk ||
      !this.lastNameRefOk ||
      !this.phoneRefOk
    ) {
      /* Switch to Reference tab */
      referentTab.tab('show');
    } else if (!this.termsAndCondOk) {
      /* Show Terms&Cond tooltip */
      tndcCheckbox.tooltip('show');
    }

    /* If validation doesn't pass for one or more inputs, change color of the relative tab */
    /* Change Authorization tab color (#e7362d = red/bad, #0fb94a = green/good) */
    if (!this.emailOk || !this.passwordOk || !this.passwordRetypeOk) {
      authTab.css('color', '#e7362d');
    } else {
      authTab.css('color', '#0fb94a');
    }

    /* Change Company tab color (#e7362d = red/bad, #0fb94a = green/good) */
    if (
      !this.pecOk ||
      !this.cuuOk ||
      !this.pIvaOk ||
      !this.cFiscaleOk ||
      !this.ragSocialeOk
    ) {
      companyTab.css('color', '#e7362d');
    } else {
      companyTab.css('color', '#0fb94a');
    }

    /* Change Reference tab color (#e7362d = red/bad, #0fb94a = green/good) */
    if (!this.firstNameRefOk || !this.lastNameRefOk || !this.phoneRefOk) {
      referentTab.css('color', '#e7362d');
    } else {
      referentTab.css('color', '#0fb94a');
    }

    /* Return complete validation checks */
    return (
      this.addressOk &&
      this.capOk &&
      this.cFiscaleOk &&
      this.cuuOk &&
      this.emailOk &&
      this.firstNameRefOk &&
      this.lastNameRefOk &&
      this.pIvaOk &&
      this.passwordOk &&
      this.passwordRetypeOk &&
      this.pecOk &&
      this.phoneRefOk &&
      this.ragSocialeOk &&
      this.termsAndCondOk
    );
  }

  /* Just check if the value is not empty */
  checkLastNameRef() {
    this.lastNameRefOk = this.validatorService.isNotEmpty(this.lastNameRef);
  }

  checkPassword() {
    this.passwordOk = this.validatorService.isValidPassword(this.password);
    /* if (this.passwordOk) {
      $('input[name="passwordRetype"]').prop('disabled', false);
    } else {
      $('input[name="passwordRetype"]').prop('disabled', true);
    } */
  }

  checkPasswordRetype() {
    this.passwordRetypeOk = this.validatorService.isValidPassRe(
      this.password,
      this.passwordRetype
    );
  }

  checkPec() {
    this.pecOk = this.validatorService.isValidEmail(this.pec);
  }

  /* Just check if the value is not empty */
  checkPhoneRef() {
    this.phoneRefOk = this.validatorService.isValidPhone(this.phoneRef);
  }

  /* Just check if the value is not empty */
  checkPIVA() {
    /* Force P.IVA without whitespaces */
    this.pIva = this.pIva.replace(/\s/g, '');
    $('input[name="pIva"]').val(this.pIva); // Always reflect change on input value

    this.pIvaOk = this.validatorService.isValidPIVA(this.pIva);
  }

  /* Just check if the value is not empty */
  checkRagSociale() {
    this.ragSocialeOk = this.validatorService.isNotEmpty(this.ragSociale);
  }

  /* Toggle Referent Tab Page Forward Button */
  checkReferentTab(): boolean {
    return !(
      this.firstNameRef &&
      this.firstNameRefOk &&
      this.lastNameRef &&
      this.lastNameRefOk &&
      this.phoneRef &&
      this.phoneRefOk
    );
  }

  checkSelectedProvince() {
    this.cityOk = false;
  }

  //#endregion
  /* ^^^ VALIDATIONS ^^^ */

  //#endregion
  /* ^^^ METHODS ^^^ */
}
