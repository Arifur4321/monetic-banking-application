import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from './../../../../services/authentication.service';
import { CityDto } from 'src/app/model/city-dto';
import { MerchantDTO } from 'src/app/model/merchant-dto';
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
import { MrcShowProfileService } from '../../services/rest/mrc-show-profile.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-mrc-modify-profile',
  templateUrl: './mrc-modify-profile.component.html',
  styleUrls: ['./mrc-modify-profile.component.css'],
})
export class MrcModifyProfileComponent implements OnInit, OnDestroy {
  /* --- ATTRIBUTES --- */

  /* FontAwesome Icons */
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faExclamationCircle = faExclamationCircle;
  faInfoCircle = faInfoCircle;

  /* flag per button */
  btnModificaProfilo: boolean = true;
  btnApplicaModicfiche: boolean = false;

  /* info merchant profile */
  userId: string;
  email: string;
  password: string;

  /* --- FORM VALUES --- */

  /* Dati azienda */
  pIva: string;
  pIvaOk: boolean = true;
  codFis: string;
  codFisOk: boolean = true;
  ragSociale: string;
  ragSocialeOk: boolean = true;

  /* Dati sede  */
  address: string;
  addressOk: boolean = true;
  province: string = '';
  provOk: boolean = true;
  city: string = '';
  cityOk: boolean = true;
  cap: string;
  capOk: boolean = true;
  telephone: string;
  telephoneOk: boolean = true;

  /* Dati office */
  officeName: string;
  officeNameOk: boolean = true;
  addressOffice: string;
  addressOfficeOk: boolean = true;
  provOffice: string = '';
  provOfficeOk: boolean = true;
  cityOffice: string = '';
  cityOfficeOk: boolean = true;
  phoneNoOffice: string;
  phoneNoOfficeOk: boolean = true;

  /* Dati Referenti */
  firstNameReq: string;
  firstNameReqOk: boolean = true;
  lastNameReq: string;
  lastNameReqOk: boolean = true;
  roleReq: string;
  roleReqOk: boolean = true;
  firstNameRef: string;
  firstNameRefOk: boolean = true;
  lastNameRef: string;
  lastNameRefOk: boolean = true;

  /* mrc dati banca */
  iban: string;
  ibanOk: boolean = true;
  bank: string;
  bankOk: boolean = true;

  /* Models */
  mrcDTO: MerchantDTO;
  cities: CityDto[];
  provinces: ProvinceDto[];
  citiesOffice: CityDto[];
  provincesOffice: ProvinceDto[];
  merchantDTO: MerchantDTO;
  merchantDTOInit: MerchantDTO;
  provinceSelectedDTO: ProvinceDto;

  /* messaggio */
  errorMsg: string = '';
  okMsg: string = 'Modifica effettuata con successo!';

  isNotModified: boolean = false;

  constructor(
    private geoService: GeographicService,
    private validatorService: ValidatorService,
    private profileService: MrcShowProfileService,
    private modalManager: ModalsManagerService,
    private authenticatorService: AuthenticationService,
    private route: Router
  ) {
    this.profileService.getShowProfile().subscribe((response) => {
      this.merchantDTO = response;
      this.merchantDTOInit = response;

      this.userId = this.authenticatorService.getLoggedUserId();
      this.email = this.merchantDTO.usrEmail;
      this.password = this.merchantDTO.usrPassword;

      this.pIva = this.merchantDTO.mrcPartitaIva;
      this.codFis = this.merchantDTO.mrcCodiceFiscale;
      this.ragSociale = this.merchantDTO.mrcRagioneSociale;
      this.address = this.merchantDTO.mrcAddress;
      this.province = this.merchantDTO.mrcProv;
      this.city = this.merchantDTO.mrcCity;
      this.cap = this.merchantDTO.mrcZip;
      this.telephone = this.merchantDTO.mrcPhoneNo;
      this.officeName = this.merchantDTO.mrcOfficeName;
      this.addressOffice = this.merchantDTO.mrcAddressOffice;
      this.provOffice = this.merchantDTO.mrcProvOffice;
      this.cityOffice = this.merchantDTO.mrcCityOffice;
      this.phoneNoOffice = this.merchantDTO.mrcPhoneNoOffice;
      this.firstNameReq = this.merchantDTO.mrcFirstNameReq;
      this.lastNameReq = this.merchantDTO.mrcLastNameReq;
      this.roleReq = this.merchantDTO.mrcRoleReq;
      this.firstNameRef = this.merchantDTO.mrcFirstNameRef;
      this.lastNameRef = this.merchantDTO.mrcLastNameRef;
      this.iban = this.merchantDTO.mrcIban;
      this.bank = this.merchantDTO.mrcBank;
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

  checkPIVA() {
    this.pIvaOk = this.validatorService.isValidPIVA(this.pIva);
  }

  checkCodFis() {
    this.codFisOk = this.validatorService.isValidCFiscale(this.codFis);
  }

  checkRagSociale() {
    this.ragSocialeOk = this.validatorService.isNotEmpty(this.ragSociale);
  }

  checkAddress() {
    this.addressOk = this.validatorService.isNotEmpty(this.address);
  }

  checkProv() {
    this.provOk = this.validatorService.isNotEmpty(this.province);
  }

  checkCity() {
    this.cityOk = this.validatorService.isNotEmpty(this.city);
  }

  checkCap() {
    this.capOk = this.validatorService.isValidCap(this.cap);
  }

  checkPhone() {
    this.telephoneOk = this.validatorService.isValidPhone(this.telephone);
  }

  checkAddressOffice() {
    this.addressOfficeOk = this.validatorService.isNotEmpty(this.addressOffice);
  }

  checkProvOffice() {
    this.provOfficeOk = this.validatorService.isNotEmpty(this.provOffice);
  }

  checkCityOffice() {
    this.cityOfficeOk = this.validatorService.isNotEmpty(this.cityOffice);
  }

  checkPhoneNoOffice() {
    this.phoneNoOfficeOk = this.validatorService.isValidPhone(
      this.phoneNoOffice
    );
  }

  /* Contact */
  checkFirstNameReq() {
    this.firstNameReqOk = this.validatorService.isNotEmpty(this.firstNameReq);
  }

  checkLastNameReq() {
    this.lastNameReqOk = this.validatorService.isNotEmpty(this.lastNameReq);
  }

  checkRoleReq() {
    this.roleReqOk = this.validatorService.isNotEmpty(this.roleReq);
  }

  checkFirstNameRef() {
    this.firstNameRefOk = this.validatorService.isNotEmpty(this.firstNameRef);
  }

  checkLastNameRef() {
    this.lastNameRefOk = this.validatorService.isNotEmpty(this.lastNameRef);
  }

  /* valido per iban italiani */
  checkIBAN() {
    /* Force IBAN without whitespaces */
    this.iban = this.iban.replace(/\s/g, '');
    $('input[name="iban"]').val(this.iban); // Always reflect change on input value

    this.ibanOk = this.validatorService.isValidIBAN(this.iban);
  }

  checkBank() {
    this.bankOk = this.validatorService.isNotEmpty(this.bank);
  }

  checkForm(): boolean {
    /* Validate merchant tab inputs */
    this.checkPIVA();
    this.checkCodFis();
    this.checkRagSociale();

    /* Validate address tab inputs */
    this.checkAddress();
    this.checkProv();
    this.checkCity();
    this.checkCap();
    this.checkPhone();

    /* Validate address tab inputs */
    this.checkAddressOffice();
    this.checkProvOffice();
    this.checkCityOffice();
    this.checkPhoneNoOffice();

    /* Validate Reference tab inputs */
    this.checkFirstNameReq();
    this.checkLastNameReq();
    this.checkRoleReq();
    this.checkFirstNameRef();
    this.checkLastNameRef();

    /* Validate bank tab inputs */
    this.checkIBAN();
    this.checkBank();

    /* Return complete validation checks */
    return (
      this.pIvaOk &&
      this.codFisOk &&
      this.ragSocialeOk &&
      this.addressOk &&
      this.provOk &&
      this.cityOk &&
      this.capOk &&
      this.telephoneOk &&
      /* this.officeNameOk && */
      this.addressOfficeOk &&
      this.provOfficeOk &&
      this.cityOfficeOk &&
      this.phoneNoOfficeOk &&
      this.firstNameReqOk &&
      this.lastNameReqOk &&
      this.roleReqOk &&
      this.firstNameRefOk &&
      this.lastNameRefOk &&
      this.ibanOk &&
      this.bankOk
    );
  }

  /* Cities & Provinces Getters and Check*/
  getCitiesByProvince() {
    this.cities = this.geoService.getAllCitiesByProvince(this.province);
  }

  getProvinces() {
    this.provinces = this.geoService.getAllProvinces();
  }

  /* Cities & Provinces Office Getters and Check */
  getCitiesByProvinceOffice() {
    this.citiesOffice = this.geoService.getAllCitiesByProvince(this.provOffice);
  }

  getProvincesOffice() {
    this.provincesOffice = this.geoService.getAllProvinces();
  }

  /* Create a merchantDTO Object using the form's inputs values */
  createMrcDTO() {
    let merchantDTO: MerchantDTO = new MerchantDTO();

    merchantDTO.usrId = this.userId;
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
    merchantDTO.mrcProv = this.province;
    merchantDTO.mrcZip = this.cap;
    merchantDTO.mrcPhoneNo = this.telephone;
    merchantDTO.mrcOfficeName = this.officeName;
    merchantDTO.mrcPhoneNoOffice = this.phoneNoOffice;
    merchantDTO.mrcAddressOffice = this.addressOffice;
    merchantDTO.mrcCityOffice = this.cityOffice;
    merchantDTO.mrcProvOffice = this.provOffice;
    merchantDTO.mrcIban = this.iban;
    merchantDTO.mrcBank = this.bank;

    return merchantDTO;
  }

  /* onClick button modificaProfilo */
  modifyField(inputName: string) {
    $('#v-pills-tabContent input,select').each(function () {
      if ($(this).attr('name') === inputName) {
        $(this).removeClass('readonly');
        $(this).addClass('modifiable');
        $(this).attr('readonly', false);
        $(this).attr('disabled', false);
        $('#mrc-mod-profile-btn-annulla').attr('disabled', false);
        $('#mrc-mod-profile-btn-apply').attr('disabled', false);
      }
    });
  }

  /* Undo changes */
  undoModify() {
    this.pIva = this.merchantDTOInit.mrcPartitaIva;
    this.codFis = this.merchantDTOInit.mrcCodiceFiscale;
    this.ragSociale = this.merchantDTOInit.mrcRagioneSociale;
    this.address = this.merchantDTOInit.mrcAddress;
    this.province = this.merchantDTOInit.mrcProv;
    this.city = this.merchantDTOInit.mrcCity;
    this.cap = this.merchantDTOInit.mrcZip;
    this.telephone = this.merchantDTOInit.mrcPhoneNo;
    this.officeName = this.merchantDTOInit.mrcOfficeName;
    this.addressOffice = this.merchantDTOInit.mrcAddressOffice;
    this.provOffice = this.merchantDTOInit.mrcProvOffice;
    this.cityOffice = this.merchantDTOInit.mrcCityOffice;
    this.phoneNoOffice = this.merchantDTOInit.mrcPhoneNoOffice;
    this.firstNameReq = this.merchantDTOInit.mrcFirstNameReq;
    this.lastNameReq = this.merchantDTOInit.mrcLastNameReq;
    this.roleReq = this.merchantDTOInit.mrcRoleReq;
    this.firstNameRef = this.merchantDTOInit.mrcFirstNameRef;
    this.lastNameRef = this.merchantDTOInit.mrcLastNameRef;
    this.iban = this.merchantDTOInit.mrcIban;
    this.bank = this.merchantDTOInit.mrcBank;

    $('input').addClass('readonly');
    $('input').removeClass('modifiable');
    $('select').removeClass('modifiable');
    $('input').attr('readonly', true);
    $('select').attr('disabled', true);

    $('#mrc-mod-profile-btn-annulla').attr('disabled', true);
    $('#mrc-mod-profile-btn-apply').attr('disabled', true);

    this.checkForm();
    this.cancelAlertNotModified();
  }

  /* Check modify */
  checkModify() {
    if (
      this.merchantDTOInit.mrcRagioneSociale !== this.ragSociale ||
      this.merchantDTOInit.mrcCodiceFiscale !== this.codFis ||
      this.merchantDTOInit.mrcPartitaIva !== this.pIva ||
      this.merchantDTOInit.mrcAddress !== this.address ||
      this.merchantDTOInit.mrcProv !== this.province ||
      this.merchantDTOInit.mrcCity !== this.city ||
      this.merchantDTOInit.mrcZip !== this.cap ||
      this.merchantDTOInit.mrcPhoneNo !== this.telephone ||
      this.merchantDTOInit.mrcOfficeName !== this.officeName ||
      this.merchantDTOInit.mrcAddressOffice !== this.addressOffice ||
      this.merchantDTOInit.mrcProvOffice !== this.provOffice ||
      this.merchantDTOInit.mrcCityOffice !== this.cityOffice ||
      this.merchantDTOInit.mrcPhoneNoOffice !== this.phoneNoOffice ||
      this.merchantDTOInit.mrcFirstNameReq !== this.firstNameReq ||
      this.merchantDTOInit.mrcLastNameReq !== this.lastNameReq ||
      this.merchantDTOInit.mrcRoleReq !== this.roleReq ||
      this.merchantDTOInit.mrcFirstNameRef !== this.firstNameRef ||
      this.merchantDTOInit.mrcLastNameRef !== this.lastNameRef ||
      this.merchantDTOInit.mrcIban !== this.iban ||
      this.merchantDTOInit.mrcBank !== this.bank
    ) {
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
        this.profileService.mrcModifyProfile(this.createMrcDTO()).subscribe(
          (response) => {
            if (response.status === 'OK') {
              /* Reset settings */
              $('input').addClass('readonly');
              $('input').removeClass('modifiable');
              $('select').removeClass('modifiable');
              $('input').attr('readonly', true);
              $('select').attr('disabled', true);
              this.isNotModified = false;
              $('#mrc-mod-profile-btn-annulla').attr('disabled', true);
              $('#mrc-mod-profile-btn-apply').attr('disabled', true);

              /* Show Success Order Modal */
              this.modalManager.successModalGeneric(
                'Modifica effettuata con successo!',
                'Modifica effettuata, controllare il tuo Profilo', '/VouChain/merchant/mrcDashboard/overview'
              );

              this.merchantDTOInit = response;
            } else {
              this.modalManager.errorsModalGeneric('Errore', 'ERRORS.GENERIC');
            }
          },
          (error) => {
            this.modalManager.errorsModalGeneric('Errore', 'ERRORS.GENERIC');
          }
        );
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
