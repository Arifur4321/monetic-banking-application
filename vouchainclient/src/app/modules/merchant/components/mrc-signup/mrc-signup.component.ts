import { Component, OnInit } from '@angular/core';

/* Router */
import { Router } from '@angular/router';

/* Services */
import { ValidatorService } from 'src/app/services/validator.service';
import { GeographicService } from 'src/app/services/rest/geographic.service';

/* --- CUSTOM IMPORTS --- */

/* Custom Messages */
import * as myMessages from 'src/globals/messages';

/* FontAwesome */
import {
  faExclamationCircle,
  faInfoCircle,
  faArrowRight,
  faArrowLeft,
  faHome,
} from '@fortawesome/free-solid-svg-icons';

/* jQuery */
declare var $: any;

/* Models */
import { CityDto } from 'src/app/model/city-dto';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { ProvinceDto } from 'src/app/model/province-dto';
import { MrcSignupService } from '../../services/rest/mrc-signup.service';
import { TranslateService } from '@ngx-translate/core';

/* Environment */
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mrc-signup',
  templateUrl: './mrc-signup.component.html',
  styleUrls: ['./mrc-signup.component.css'],
})
export class MrcSignupComponent implements OnInit {
  /* --- ATTRIBUTES --- */

  /* FontAwesome Icons */
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faExclamationCircle = faExclamationCircle;
  faInfoCircle = faInfoCircle;
  fasHome = faHome;

  /* Authentication */
  email: string;
  emailOk: boolean = true;
  emailOkButton: boolean = false;
  password: string;
  passwordOk: boolean = true;
  passwordOkButton: boolean = false;
  passwordRetype: string;
  passwordRetypeOk: boolean = true;
  passwordRetypeOkButton: boolean = false;

  /* Dati azienda */
  pIva: string;
  pIvaOk: boolean = true;
  pIvaOkButton: boolean = false;
  codFis: string;
  codFisOk: boolean = true;
  codFisOkButton: boolean = false;
  ragSociale: string;
  ragSocialeOk: boolean = true;
  ragSocialeOkButton: boolean = false;

  /* Dati sede  */
  address: string;
  addressOk: boolean = true;
  addressOkButton: boolean = false;
  province: string = '';
  provOk: boolean = true;
  provOkButton: boolean = false;
  city: string = '';
  cityOk: boolean = true;
  /* cityOkInfo is to check if a province is selected */
  cityOkInfo: boolean = true;
  cityOkButton: boolean = false;
  cap: string;
  capOk: boolean = true;
  capOkButton: boolean = false;
  telephone: string;
  telephoneOk: boolean = true;
  telephoneOkButton: boolean = false;

  /* Dati office */
  officeName: string;
  officeNameOk: boolean = true;
  officeNameOkButton: boolean = false;
  addressOffice: string;
  addressOfficeOk: boolean = true;
  addressOfficeOkButton: boolean = false;
  provOffice: string = '';
  provOfficeOk: boolean = true;
  provOfficeOkButton: boolean = false;
  cityOffice: string = '';
  cityOfficeOk: boolean = true;
  /* cityOfficeInfoOk is to check if a province is selected */
  cityOfficeInfoOk: boolean = true;
  cityOfficeOkButton: boolean = true;
  phoneNoOffice: string;
  phoneNoOfficeOk: boolean = true;
  phoneNoOfficeOkButton: boolean = true;

  /* Dati Referenti */
  firstNameReq: string;
  firstNameReqOk: boolean = true;
  firstNameReqOkButton: boolean = false;
  lastNameReq: string;
  lastNameReqOk: boolean = true;
  lastNameReqOkButton: boolean = false;
  roleReq: string;
  roleReqOk: boolean = true;
  roleReqOkButton: boolean = false;
  firstNameRef: string;
  firstNameRefOk: boolean = true;
  firstNameRefOkButton: boolean = false;
  lastNameRef: string;
  lastNameRefOk: boolean = true;
  lastNameRefOkButton: boolean = false;

  /* mrc dati banca */
  iban: string;
  ibanOk: boolean = true;
  ibanOkButton: boolean = false;
  bank: string;
  bankOk: boolean = true;
  bankOkButton: boolean = false;

  /* Terms & Conditions */
  termsAndCondOk: boolean;

  /* Messages */
  msgSignupBody: string;
  msgSignupBodyShow: boolean = false;
  msgSignupButton: string;

  /* Models */
  mrcDTO: MerchantDTO;
  cities: CityDto[];
  provinces: ProvinceDto[];
  citiesOffice: CityDto[];
  provincesOffice: ProvinceDto[];

  /* Status */
  signupOk: boolean = false;

  /* Homepage link */
  homepage: string = environment.homeUrl;

  constructor(
    private mrcSignupService: MrcSignupService,
    private geoService: GeographicService,
    private route: Router,
    private translatorService: TranslateService,
    private validatorService: ValidatorService
  ) { }

  ngOnInit(): void {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });

    /* Disables forward buttons */
    $('#mrc-signup-button-profile')
      .removeClass('btn-primary')
      .addClass('btn-secondary')
      .attr('disabled', true);
    $('#mrc-signup-button-headOffice')
      .removeClass('btn-primary')
      .addClass('btn-secondary')
      .attr('disabled', true);
    $('#mrc-signup-button-contact')
      .removeClass('btn-primary')
      .addClass('btn-secondary')
      .attr('disabled', true);
    $('#mrc-signup-button-submit')
      .removeClass('btn-primary')
      .addClass('btn-secondary')
      .attr('disabled', true);

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

  /* --- METHODS --- */

  /* Returns a Merchant DTO */
  createMrcDTO() {
    let merchantDTO: MerchantDTO = new MerchantDTO();

    merchantDTO.usrEmail = this.email;
    merchantDTO.usrPassword = this.password;
    merchantDTO.mrcRagioneSociale = this.ragSociale;
    merchantDTO.mrcPartitaIva = this.pIva;
    merchantDTO.mrcCodiceFiscale = this.codFis;
    merchantDTO.mrcFirstNameReq = this.firstNameReq;
    merchantDTO.mrcLastNameReq = this.lastNameReq;
    merchantDTO.mrcRoleReq = this.roleReq;
    merchantDTO.mrcFirstNameRef = this.firstNameRef;
    merchantDTO.mrcLastNameRef = this.lastNameRef;
    merchantDTO.mrcAddress = this.address;
    merchantDTO.mrcCity = this.city;
    merchantDTO.mrcProv = this.province.split(', ')[1];
    merchantDTO.mrcZip = this.cap;
    merchantDTO.mrcPhoneNo = this.telephone;
    merchantDTO.mrcOfficeName = this.officeName;
    merchantDTO.mrcPhoneNoOffice = this.phoneNoOffice;
    merchantDTO.mrcAddressOffice = this.addressOffice;
    merchantDTO.mrcCityOffice = this.cityOffice;
    merchantDTO.mrcProvOffice = this.provOffice.split(', ')[1];
    merchantDTO.mrcIban = this.iban;
    merchantDTO.mrcBank = this.bank;

    return merchantDTO;
  }

  /* Check validation */
  checkForm(): boolean {
    if (
      !this.emailOk ||
      !this.passwordOk ||
      !this.passwordRetypeOk ||
      !this.pIvaOk ||
      !this.codFisOk ||
      !this.ragSocialeOk
    ) {
      $('#nav-profile-tab').css('color', '#e7362d');
      $('#nav-profile-tab').tab('show');
    } else {
      $('#nav-profile-tab').css('color', '#0fb94a');
    }

    if (
      !this.addressOk ||
      !this.provOk ||
      !this.cityOk ||
      !this.capOk ||
      !this.telephoneOk
    ) {
      $('#nav-headOffice-tab').css('color', '#e7362d');
      $('#nav-headOffice-tab').tab('show');
    } else {
      $('#nav-headOffice-tab').css('color', '#0fb94a');
    }

    if (
      !this.firstNameReqOk ||
      !this.lastNameReqOk ||
      !this.roleReqOk ||
      !this.firstNameRefOk ||
      !this.lastNameRefOk
    ) {
      $('#nav-contact-tab').css('color', '#e7362d');
      $('#nav-contact-tab').tab('show');
    } else {
      $('#nav-contact-tab').css('color', '#0fb94a');
    }

    this.checkIBAN();
    this.checkBank();

    if (!this.ibanOk || !this.bankOk) {
      $('#nav-bank-tab').css('color', '#e7362d');
      $('#nav-bank-tab').tab('show');
    } else {
      $('#nav-bank-tab').css('color', '#0fb94a');
    }

    if (!this.termsAndCondOk) {
      $('#termsCheckbox').tooltip('show');
    }

    return (
      this.emailOk &&
      this.passwordOk &&
      this.passwordRetypeOk &&
      this.pIvaOk &&
      this.codFisOk &&
      this.ragSocialeOk &&
      this.addressOk &&
      this.provOk &&
      this.cityOk &&
      this.capOk &&
      this.telephoneOk &&
      this.firstNameReqOk &&
      this.lastNameReqOk &&
      this.roleReqOk &&
      this.firstNameRefOk &&
      this.lastNameRefOk &&
      this.ibanOk &&
      this.bankOk
    );
  }

  /* Validation */

  /* First tab */
  checkEmail() {
    this.emailOk = this.validatorService.isValidEmail(this.email);
    this.emailOkButton = this.validatorService.isValidEmail(this.email);
    this.onInputFieldsProfile();
  }

  checkPassword() {
    this.passwordOk = this.validatorService.isValidPassword(this.password);
    this.passwordOkButton = this.validatorService.isValidPassword(
      this.password
    );
    this.onInputFieldsProfile();
  }

  checkPasswordRetype() {
    this.passwordRetypeOk = this.validatorService.isValidPassRe(
      this.password,
      this.passwordRetype
    );
    this.passwordRetypeOkButton = this.validatorService.isValidPassRe(
      this.password,
      this.passwordRetype
    );
    this.onInputFieldsProfile();
  }

  checkPIVA() {
    /* Force P.IVA without whitespaces */
    this.pIva = this.pIva.replace(/\s/g, '');
    $('input[name="pIva"]').val(this.pIva); // Always reflect change on input value

    this.pIvaOk = this.validatorService.isValidPIVA(this.pIva);
    this.pIvaOkButton = this.validatorService.isValidPIVA(this.pIva);
    this.onInputFieldsProfile();
  }

  checkCodFis() {

    /* Force Cod.Fiscale without whitespaces */
    this.codFis = this.codFis.replace(/\s/g, '');
    $('input[name="codFis"]').val(this.codFis); // Always reflect change on input value

    this.codFisOk = this.validatorService.isValidCFiscale(this.codFis);
    this.codFisOkButton = this.validatorService.isValidCFiscale(this.codFis);
    this.onInputFieldsProfile();
  }

  checkRagSociale() {
    this.ragSocialeOk = this.validatorService.isNotEmpty(this.ragSociale);
    this.ragSocialeOkButton = this.validatorService.isNotEmpty(this.ragSociale);
    this.onInputFieldsProfile();
  }

  /* Changes the button color */
  onInputFieldsProfile() {
    if (
      this.emailOkButton &&
      this.passwordOkButton &&
      this.passwordRetypeOkButton &&
      this.pIvaOkButton &&
      this.codFisOkButton &&
      this.ragSocialeOkButton
    ) {
      $('#mrc-signup-button-profile')
        .removeClass('btn-secondary')
        .addClass('btn-primary')
        .attr('disabled', false);
    } else {
      $('#mrc-signup-button-profile')
        .removeClass('btn-primary')
        .addClass('btn-secondary')
        .attr('disabled', true);
    }
  }

  /* Second tab */
  checkAddress() {
    this.addressOk = this.validatorService.isNotEmpty(this.address);
    this.addressOkButton = this.validatorService.isNotEmpty(this.address);
    this.onInputFieldsHeadOffice();
  }

  checkProv() {
    if (this.province) {
      this.provOk = true;
      this.provOkButton = true;
    } else {
      this.provOk = false;
      this.provOkButton = false;
    }
    this.onInputFieldsHeadOffice();
  }

  checkCity() {
    if (this.city) {
      this.cityOk = true;
      this.cityOkButton = true;
    } else {
      this.cityOk = false;
      this.cityOkButton = false;
    }
    this.onInputFieldsHeadOffice();
  }

  checkCap() {
    this.capOk = this.validatorService.isValidCap(this.cap);
    this.capOkButton = this.validatorService.isValidCap(this.cap);
    this.onInputFieldsHeadOffice();
  }

  checkPhone() {
    this.telephoneOk = this.validatorService.isValidPhone(this.telephone);
    this.telephoneOkButton = this.validatorService.isValidPhone(this.telephone);
    this.onInputFieldsHeadOffice();
  }

  /* Changes the button color */
  onInputFieldsHeadOffice() {
    if (
      this.addressOkButton &&
      this.provOkButton &&
      this.cityOkButton &&
      this.capOkButton &&
      this.telephoneOkButton
    ) {
      $('#mrc-signup-button-headOffice')
        .removeClass('btn-secondary')
        .addClass('btn-primary')
        .attr('disabled', false);
    } else {
      $('#mrc-signup-button-headOffice')
        .removeClass('btn-primary')
        .addClass('btn-secondary')
        .attr('disabled', true);
    }
  }

  /* Third tab */
  /* Only if different from head office */
  checkOfficeName() {
    this.officeNameOk = this.validatorService.isNotEmpty(this.officeName);
    this.officeNameOkButton = this.validatorService.isNotEmpty(this.officeName);
    this.onInputFieldsOffice();
  }

  checkAddressOffice() {
    this.addressOfficeOk = this.validatorService.isNotEmpty(this.addressOffice);
    this.addressOfficeOkButton = this.validatorService.isNotEmpty(
      this.addressOffice
    );
    this.onInputFieldsOffice();
  }

  checkProvOffice() {
    if (this.provOffice) {
      this.provOfficeOk = true;
      this.provOfficeOkButton = true;
    } else {
      this.provOfficeOk = false;
      this.provOfficeOkButton = false;
    }
    this.onInputFieldsOffice();
  }

  checkCityOffice() {
    if (this.cityOffice) {
      this.cityOfficeOk = true;
      this.cityOfficeOkButton = true;
    } else {
      this.cityOfficeOk = false;
      this.cityOfficeOkButton = false;
    }
    this.onInputFieldsOffice();
  }

  checkPhoneNoOffice() {
    this.phoneNoOfficeOk = this.validatorService.isValidPhone(
      this.phoneNoOffice
    );
    this.phoneNoOfficeOkButton = this.validatorService.isValidPhone(
      this.phoneNoOffice
    );
    this.onInputFieldsOffice();
  }

  /* Changes the button color */
  onInputFieldsOffice() {
    if (
      this.officeNameOkButton &&
      this.addressOfficeOkButton &&
      this.provOfficeOkButton &&
      this.cityOfficeOkButton &&
      this.phoneNoOfficeOkButton
    ) {
      $('#mrc-signup-button-office')
        .removeClass('btn-secondary')
        .addClass('btn-primary')
        .attr('disabled', false);
    } else {
      $('#mrc-signup-button-office')
        .removeClass('btn-primary')
        .addClass('btn-secondary')
        .attr('disabled', true);
    }
  }

  /* Forth tab */
  checkFirstNameReq() {
    this.firstNameReqOk = this.validatorService.isNotEmpty(this.firstNameReq);
    this.firstNameReqOkButton = this.validatorService.isNotEmpty(
      this.firstNameReq
    );
    this.onInputFieldsContact();
  }

  checkLastNameReq() {
    this.lastNameReqOk = this.validatorService.isNotEmpty(this.lastNameReq);
    this.lastNameReqOkButton = this.validatorService.isNotEmpty(
      this.lastNameReq
    );
    this.onInputFieldsContact();
  }

  checkRoleReq() {
    this.roleReqOk = this.validatorService.isNotEmpty(this.roleReq);
    this.roleReqOkButton = this.validatorService.isNotEmpty(this.roleReq);
    this.onInputFieldsContact();
  }

  checkFirstNameRef() {
    this.firstNameRefOk = this.validatorService.isNotEmpty(this.firstNameRef);
    this.firstNameRefOkButton = this.validatorService.isNotEmpty(
      this.firstNameRef
    );
    this.onInputFieldsContact();
  }

  checkLastNameRef() {
    this.lastNameRefOk = this.validatorService.isNotEmpty(this.lastNameRef);
    this.lastNameRefOkButton = this.validatorService.isNotEmpty(
      this.lastNameRef
    );
    this.onInputFieldsContact();
  }

  /* Changes the button color */
  onInputFieldsContact() {
    if (
      this.firstNameRefOkButton &&
      this.lastNameRefOkButton &&
      this.roleReqOkButton &&
      this.firstNameReqOkButton &&
      this.lastNameReqOkButton
    ) {
      $('#mrc-signup-button-contact')
        .removeClass('btn-secondary')
        .addClass('btn-primary')
        .attr('disabled', false);
    } else {
      $('#mrc-signup-button-contact')
        .removeClass('btn-primary')
        .addClass('btn-secondary')
        .attr('disabled', true);
    }
  }

  /* Fifth tab */
  checkIBAN() {
    /* Force IBAN without whitespaces */
    this.iban = this.iban.replace(/\s/g, '');
    $('input[name="iban"]').val(this.iban); // Always reflect change on input value

    this.ibanOk = this.validatorService.isValidIBAN(this.iban);
    this.ibanOkButton = this.validatorService.isValidIBAN(this.iban);
    this.onInputFieldsBank();
  }

  checkBank() {
    this.bankOk = this.validatorService.isNotEmpty(this.bank);
    this.bankOkButton = this.validatorService.isNotEmpty(this.bank);
    this.onInputFieldsBank();
  }

  /* Changes the button color */
  onInputFieldsBank() {
    if (
      this.ibanOkButton &&
      this.bankOkButton &&
      $('#termsCheckbox').prop('checked')
    ) {
      $('#mrc-signup-button-submit')
        .removeClass('btn-secondary')
        .addClass('btn-primary')
        .attr('disabled', false);
    } else {
      $('#mrc-signup-button-submit')
        .removeClass('btn-primary')
        .addClass('btn-secondary')
        .attr('disabled', true);
    }
  }

  /* Cities & Provinces Getters and Check*/
  checkSelectedProvince() {
    this.cityOkInfo = false;
  }

  getCitiesByProvince() {
    this.cities = this.geoService.getAllCitiesByProvince(
      this.province.split(', ')[1]
    );
  }

  getProvinces() {
    this.provinces = this.geoService.getAllProvinces();
  }

  /* Cities & Provinces Office Getters and Check */
  checkSelectedProvinceOffice() {
    this.cityOfficeInfoOk = false;
  }

  getCitiesByProvinceOffice() {
    this.citiesOffice = this.geoService.getAllCitiesByProvince(
      this.provOffice.split(', ')[1]
    );
  }

  getProvincesOffice() {
    this.provincesOffice = this.geoService.getAllProvinces();
  }

  /* Submit Form */
  onFormSubmit() {
    /* Reset Modal to default state */
    $('#btn-modal-close').prop('disabled', true);
    $('#btn-modal-close span').show(); /* Unhide the loading icon */
    this.signupOk = false;
    this.msgSignupBodyShow = false;
    this.msgSignupButton = this.translatorService.instant(
      'SIGNUP.MODAL.LOADING_BUTTON'
    );

    if (this.checkForm()) {
      /* Show a 'static' Modal (user can't close it by clicking outside or pressing on the keyboard) */
      $('#modalConfirmSignup').modal({ backdrop: 'static', keyboard: false });
      $('#modalConfirmSignup').modal('show');

      this.mrcSignupService
        .merchantSignup(this.createMrcDTO())
        .subscribe((response) => {
          /* Assign the response DTO to an attribute DTO */
          this.mrcDTO = response;

          /* Check if registration is successful */
          if (this.mrcDTO.status === 'OK') {
            /* Show instructions for successful registration */
            this.signupOk = true;
            this.msgSignupBodyShow = true;
            this.msgSignupBody = this.translatorService.instant(
              'SIGNUP.MODAL.RESPONSE_BODY_EMP_OK'
            );
            this.msgSignupButton = this.translatorService.instant(
              'SIGNUP.MODAL.GO_LOGIN'
            );

            /* Hide loading icon and enable the 'Go to login' button */
            $('#btn-modal-close span').hide();
            $('#btn-modal-close').removeAttr('disabled');
          } else if (
            this.mrcDTO.errorDescription === myMessages.emailAlreadyExist
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
            $('#btn-modal-close span').hide();
            $('#btn-modal-close').removeAttr('disabled');
          } else {
            /* Show error messages ('Email already exist') */
            this.msgSignupBodyShow = true;
            this.msgSignupBody = this.translatorService.instant(
              'ERRORS.GENERIC'
            );
            this.msgSignupButton = this.translatorService.instant(
              'SIGNUP.MODAL.RETRY'
            );

            /* Hide loading icon and enable the 'Retry' button */
            $('#btn-modal-close span').hide();
            $('#btn-modal-close').removeAttr('disabled');
          }
        });
    }
  }

  /* --- BUTTONS --- */

  goBackwardTab() {
    $('.nav-tabs > .active').prev('a').trigger('click');
  }

  goForwardTab() {
    /* Check which tab is currently active */
    if ($('#nav-profile').hasClass('active')) {
      /* Force check on all tab's inputs */
      this.checkEmail();
      this.checkPassword();
      this.checkPasswordRetype();
      this.checkPIVA();
      this.checkCodFis();
      this.checkRagSociale();
      /* If check pass: color current tab 'green', unlock and go to next tab  */
      if (
        this.emailOk &&
        this.passwordOk &&
        this.passwordRetypeOk &&
        this.pIva &&
        this.codFis &&
        this.ragSociale
      ) {
        $('#nav-profile-tab').css('color', '#0fb94a');
        $('.nav-tabs > .active')
          .next('a')
          .removeClass('disabled')
          .trigger('click');
      }
    } else if ($('#nav-headOffice').hasClass('active')) {
      this.checkAddress();
      this.checkProv();
      this.checkCity();
      this.checkCap();
      this.checkPhone();
      if (
        this.addressOk &&
        this.provOk &&
        this.cityOk &&
        this.capOk &&
        this.telephoneOk
      ) {
        $('#nav-headOffice-tab').css('color', '#0fb94a');
        $('.nav-tabs > .active')
          .next('a')
          .removeClass('disabled')
          .trigger('click');
        this.onCheckboxSelected();
      } else if (
        !this.addressOk ||
        !this.provOk ||
        !this.cityOk ||
        !this.capOk ||
        !this.telephoneOk
      ) {
        $('#mrc-city-req').hide();
      }
    } else if ($('#nav-office').hasClass('active')) {
      this.checkAddressOffice();
      this.checkProvOffice();
      this.checkCityOffice();
      this.checkPhoneNoOffice();
      if (
        this.addressOfficeOk &&
        this.provOfficeOk &&
        this.cityOfficeOk &&
        this.phoneNoOfficeOk
      ) {
        $('#nav-office-tab').css('color', '#0fb94a');
        $('.nav-tabs > .active')
          .next('a')
          .removeClass('disabled')
          .trigger('click');
      } else if (
        !this.addressOfficeOk ||
        !this.provOfficeOk ||
        !this.cityOfficeOk ||
        !this.phoneNoOfficeOk
      ) {
        $('#mrc-city-req-office').hide();
      }
    } else if ($('#nav-contact').hasClass('active')) {
      this.checkFirstNameRef();
      this.checkLastNameRef();
      this.checkRoleReq();
      this.checkFirstNameReq();
      this.checkLastNameReq();
      if (
        this.firstNameRefOk &&
        this.lastNameRefOk &&
        this.roleReqOk &&
        this.firstNameReqOk &&
        this.lastNameReqOk
      ) {
        $('#nav-contact-tab').css('color', '#0fb94a');
        $('.nav-tabs > .active')
          .next('a')
          .removeClass('disabled')
          .trigger('click');
      }
    }
  }

  goLogin() {
    /* Check whether signup went okay or not */
    if (this.signupOk) {
      /* Hide modal before going to login page */
      $('#modalConfirmSignup').modal('hide');

      this.route.navigate(['merchant/mrcLogin']);
    } else {
      $('#modalConfirmSignup').modal('hide');
    }
  }

  /* Enables fields in third tab */
  onCheckboxSelected() {
    if ($('#mrc-signup-checkbox-office').prop('checked')) {
      this.officeNameOkButton = true;
      this.phoneNoOffice = this.telephone;
      this.addressOffice = this.address;
      this.cityOffice = this.city;
      this.provOffice = this.province;
      /* Clean messages */
      this.cityOfficeInfoOk = false;
      this.officeNameOk = true;
      this.addressOfficeOk = true;
      this.provOfficeOk = true;
      this.cityOfficeOk = true;
      this.phoneNoOfficeOk = true;
      $('#mrc-signup-office-name').attr('readonly', true);
      $('#mrc-signup-office-address').attr('readonly', true);
      $('#mrc-signup-office-province').attr('disabled', true);
      $('#mrc-signup-office-city').attr('disabled', true);
      $('#mrc-signup-office-telephone').attr('readonly', true);
      $('#mrc-signup-button-office')
        .removeClass('btn-secondary')
        .addClass('btn-primary')
        .attr('disabled', false);
    } else {
      this.officeNameOkButton = false;
      this.officeName = '';
      this.phoneNoOffice = '';
      this.addressOffice = '';
      this.cityOffice = '';
      this.provOffice = '';
      this.cityOfficeInfoOk = true;
      $('#mrc-signup-office-name').attr('readonly', false);
      $('#mrc-signup-office-address').attr('readonly', false);
      $('#mrc-signup-office-province').attr('disabled', false);
      $('#mrc-signup-office-city').attr('disabled', false);
      $('#mrc-signup-office-telephone').attr('readonly', false);
      $('#mrc-signup-button-office')
        .removeClass('btn-primary')
        .addClass('btn-secondary')
        .attr('disabled', true);
    }
  }
}
