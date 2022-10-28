import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthenticationService } from './../../../../services/authentication.service';
import { CityDto } from 'src/app/model/city-dto';
import { CompanyDTO } from 'src/app/model/company-dto';
import { ProvinceDto } from 'src/app/model/province-dto';
import { ValidatorService } from 'src/app/services/validator.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

/* FontAwesome */
import {
  faArrowLeft,
  faArrowRight,
  faExclamationCircle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { GeographicService } from 'src/app/services/rest/geographic.service';
import { CpyShowProfileService } from '../../services/rest/cpy-show-profile.service';
import { Router } from '@angular/router';
import { HttpInterceptorService } from 'src/app/services/http/http-interceptor.service';

declare var $: any;

@Component({
  selector: 'app-cpy-modify-profile',
  templateUrl: './cpy-modify-profile.component.html',
  styleUrls: ['./cpy-modify-profile.component.css']
})
export class CpyModifyProfileComponent implements OnInit, OnDestroy {

  /* --- ATTRIBUTES --- */

  /* FontAwesome Icons */
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faExclamationCircle = faExclamationCircle;
  faInfoCircle = faInfoCircle;

  /* flag per button */
  btnModificaProfilo: boolean = true;
  btnApplicaModicfiche: boolean = false;

  /* info company profile */
  userId: string;
  email: string;
  password: string;

  /* --- FORM VALUES --- */

  /* PEC */
  pec: string;
  pecOk: boolean = true;

  /* Partita IVA */
  pIva: string;
  pIvaOk: boolean = true;

  /* Codice Fiscale */
  cFiscale: string;
  cFiscaleOk: boolean = true;

  /* Ragione Sociale */
  ragSociale: string;
  ragSocialeOk: boolean = true;

  /* Codice Univoco */
  cuu: string;
  cuuOk: boolean = true;

  /* First & Last Name */
  firstNameRef: string;
  firstNameRefOk: boolean = true;
  lastNameRef: string;
  lastNameRefOk: boolean = true;

  /* Telephone */
  phoneRef: string;
  phoneRefOk: boolean = true;

  /* Province Selection */
  provSelect: string = '';
  provOk: boolean = true;

  /* Address */
  address: string;
  addressOk: boolean = true;

  /* ZIP Code */
  cap: string;
  capOk: boolean = true;

  /* City info */
  cityOk: boolean = false;

  /* City Selection */
  citySelectOk: boolean = true;
  citySelect: string = '';

  /* Models */
  cities: CityDto[];
  cpyDTO: CompanyDTO;
  provinces: ProvinceDto[];
  companyDTO: CompanyDTO;
  companyDTOInit: CompanyDTO;
  provinceSelectedDTO: ProvinceDto;

  /* messaggio */
  errorMsg: string = '';
  okMsg: string = 'Modifica effettuata con successo!';

  isNotModified: boolean = false;

  constructor(private geoService: GeographicService, private validatorService: ValidatorService, private profileService: CpyShowProfileService, private modalManager: ModalsManagerService, private authenticatorService: AuthenticationService, private route: Router) {

    this.profileService.getShowProfile().subscribe((response) => {
      this.companyDTO = response;
      this.companyDTOInit = response;

      this.userId = this.authenticatorService.getLoggedUserId();
      this.email = this.companyDTO.usrEmail;
      this.password = this.companyDTO.usrPassword;

      this.pec = this.companyDTO.cpyPec;
      this.pIva = this.companyDTO.cpyPartitaIva;
      this.cFiscale = this.companyDTO.cpyCodiceFiscale;
      this.ragSociale = this.companyDTO.cpyRagioneSociale;
      this.cuu = this.companyDTO.cpyCuu;
      this.firstNameRef = this.companyDTO.cpyFirstNameRef;
      this.lastNameRef = this.companyDTO.cpyLastNameRef;
      this.phoneRef = this.companyDTO.cpyPhoneNoRef;
      this.address = this.companyDTO.cpyAddress;
      this.provSelect = this.companyDTO.cpyProv;
      this.citySelect = this.companyDTO.cpyCity;
      this.cap = this.companyDTO.cpyZip;

    });

  }

  ngOnInit(): void {

    $('input').attr('readonly', true);
    $('select').attr('disabled', true);

    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });
  }

  ngOnDestroy(): void {
    /* Hide Bootstrap Tooltips when switch component/page */
    $(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  /* --- VALIDATIONS --- */

  checkPec() {
    this.pecOk = this.validatorService.isValidEmail(this.pec);
  }

  /* Just check if the value is not empty */
  checkPIVA() {
    this.pIvaOk = this.validatorService.isValidPIVA(this.pIva);
  }

  /* Just check if the value is not empty */
  checkCFiscale() {
    this.cFiscaleOk = this.validatorService.isValidCFiscale(this.cFiscale);
  }

  /* Just check if the value is not empty */
  checkRagSociale() {
    this.ragSocialeOk = this.validatorService.isNotEmpty(this.ragSociale);
  }

  checkCuu() {
    this.cuuOk = this.validatorService.isValidCuu(this.cuu);
  }

  /* Just check if the value is not empty */
  checkFirstNameRef() {
    this.firstNameRefOk = this.validatorService.isNotEmpty(this.firstNameRef);
  }

  /* Just check if the value is not empty */
  checkLastNameRef() {
    this.lastNameRefOk = this.validatorService.isNotEmpty(this.lastNameRef);
  }

  /* Just check if the value is not empty */
  checkPhoneRef() {
    this.phoneRefOk = this.validatorService.isValidPhone(this.phoneRef);
  }

  /* Just check if the value is not empty */
  checkAddress() {
    this.addressOk = this.validatorService.isNotEmpty(this.address);
  }

  /* Just check if the value is not empty */
  checkProv() {
    this.provOk = this.validatorService.isNotEmpty(this.provSelect);
  }

  /* Just check if the value is not empty */
  checkCity() {
    this.citySelectOk = this.validatorService.isNotEmpty(this.citySelect);
  }

  checkSelectedProvince() {
    this.cityOk = false;
  }

  checkCap() {
    this.capOk = this.validatorService.isValidCap(this.cap);
  }

  checkForm(): boolean {

    /* Validate Company tab inputs */
    this.checkPec();
    this.checkPIVA();
    this.checkCFiscale();
    this.checkRagSociale();
    this.checkCuu();
    this.checkCap();

    this.checkAddress();
    this.checkProv();
    this.checkCity();

    /* Validate Reference tab inputs */
    this.checkFirstNameRef();
    this.checkLastNameRef();
    this.checkPhoneRef();

    /* Return complete validation checks */
    return (
      this.addressOk &&
      this.capOk &&
      this.cFiscaleOk &&
      this.cuuOk &&
      this.provOk &&
      this.citySelectOk &&
      this.firstNameRefOk &&
      this.lastNameRefOk &&
      this.pIvaOk &&
      this.pecOk &&
      this.phoneRefOk &&
      this.ragSocialeOk
    );
  }

  /* Cities & Provinces Getters */
  getCitiesByProvince() {
    this.cities = this.geoService.getAllCitiesByProvince(this.provSelect);
  }

  getProvinces() {
    this.provinces = this.geoService.getAllProvinces();
  }

  /* Create a CompanyDTO Object using the form's inputs values */
  createCpyDTO() {
    let companyDTO: CompanyDTO = new CompanyDTO();

    companyDTO.usrEmail = this.email;
    companyDTO.usrId = this.userId;
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
    companyDTO.cpyProv = this.provSelect;
    companyDTO.cpyZip = this.cap;

    return companyDTO;
  }

  /* onClick button modificaProfilo */
  modifyField(inputName: string) {

    $('#v-pills-tabContent input,select').each(function () {
      if ($(this).attr('name') === inputName) {
        $(this).removeClass("readonly");
        $(this).addClass("modifiable");
        $(this).attr('readonly', false);
        $(this).attr('disabled', false);
        $("#cpy-mod-profile-btn-annulla").attr("disabled", false);
        $("#cpy-mod-profile-btn-apply").attr("disabled", false);
      }
    })

  }

  /* Undo changes */
  undoModify() {
    this.pec = this.companyDTOInit.cpyPec;
    this.pIva = this.companyDTOInit.cpyPartitaIva;
    this.cFiscale = this.companyDTOInit.cpyCodiceFiscale;
    this.ragSociale = this.companyDTOInit.cpyRagioneSociale;
    this.cuu = this.companyDTOInit.cpyCuu;
    this.firstNameRef = this.companyDTOInit.cpyFirstNameRef;
    this.lastNameRef = this.companyDTOInit.cpyLastNameRef;
    this.phoneRef = this.companyDTOInit.cpyPhoneNoRef;
    this.address = this.companyDTOInit.cpyAddress;
    this.provSelect = this.companyDTOInit.cpyProv;
    this.citySelect = this.companyDTOInit.cpyCity;
    this.cap = this.companyDTOInit.cpyZip;

    $('input').addClass("readonly");
    $('input').removeClass("modifiable");
    $('select').removeClass("modifiable");
    $('input').attr('readonly', true);
    $('select').attr('disabled', true);

    $("#cpy-mod-profile-btn-annulla").attr("disabled", true);
    $("#cpy-mod-profile-btn-apply").attr("disabled", true);

    this.checkForm();
    this.cancelAlertNotModified();
  }

  /* Check modify */
  checkModify() {
    if (this.companyDTOInit.cpyRagioneSociale !== this.ragSociale || this.companyDTOInit.cpyCodiceFiscale !== this.cFiscale
      || this.companyDTOInit.cpyPartitaIva !== this.pIva || this.companyDTOInit.cpyCuu !== this.cuu
      || this.companyDTOInit.cpyPec !== this.pec
      || this.companyDTOInit.cpyAddress !== this.address || this.companyDTOInit.cpyCity !== this.citySelect
      || this.companyDTOInit.cpyProv !== this.provSelect || this.companyDTOInit.cpyFirstNameRef
      !== this.firstNameRef || this.companyDTOInit.cpyLastNameRef !== this.lastNameRef
      || this.companyDTOInit.cpyZip !== this.cap || this.companyDTOInit.cpyPhoneNoRef !== this.phoneRef) {
      this.isNotModified = false;
      return true;
    } else {
      this.isNotModified = true;
      return false;
    }
  }

  /* Submit Form */
  onFormSubmit() {

    if (this.checkModify()) {
      if (this.checkForm()) {
        this.profileService.cpyModifyProfile(this.createCpyDTO()).subscribe((response) => {

          if (response.status === 'OK') {
            $('input').addClass("readonly");
            $('input').removeClass("modifiable");
            $('select').removeClass("modifiable");
            $('input').attr('readonly', true);
            $('select').attr('disabled', true);
            this.isNotModified = false;
            $("#cpy-mod-profile-btn-annulla").attr("disabled", true);
            $("#cpy-mod-profile-btn-apply").attr("disabled", true);

            /* Show Success Order Modal */
            this.modalManager.successModalGeneric(
              'Modifica effettuata con successo!',
              'Modifica effettuata, controllare il tuo Profilo', '/VouChain/company/cpyDashboard/overview'
            );

            this.companyDTOInit = response;

          } else {
            this.modalManager.errorsModalGeneric(
              'Errore',
              'ERRORS.GENERIC'
            );
          }

        }, (error) => {
          this.modalManager.errorsModalGeneric(
            'Errore',
            'ERRORS.GENERIC'
          );
        });
      } else {
        this.modalManager.errorsModalGeneric(
          'Errore',
          'Campi modificati non validi'
        );
      }
    }
  }

  /* --- BUTTONS --- */
  goBackwardTab() {
    $('.nav-pills > .active').prev('a').trigger('click');
    this.cancelAlertNotModified();
  }

  goForwardTab() {
    $('.nav-pills > .active').next('a').trigger('click');
    this.cancelAlertNotModified();
  }

  cancelAlertNotModified() {
    this.isNotModified = false;
  }
}
