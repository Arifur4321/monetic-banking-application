import { ValidatorService } from 'src/app/services/validator.service';
/* --- DEFAULTS IMPORTS --- */
import { Component, OnDestroy, OnInit } from '@angular/core';
/* FontAwesome */
import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleDoubleUp,
  faHashtag,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

/* jQuery */
declare var $: any;

/* Locales */
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

/* Models */
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { DTOList } from 'src/app/model/dto-list';

/* Router */
import { EmpShowMerchantsService } from '../../services/rest/emp-show-merchants.service';
import { EmpVouchersService } from '../../services/rest/emp-vouchers.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { VoucherAllocationDTO } from 'src/app/model/voucher-allocation-dto';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-emp-vouchers',
  templateUrl: './emp-vouchers.component.html',
  styleUrls: ['./emp-vouchers.component.css']
})
export class EmpVouchersComponent implements OnInit {

  /* FontAwesome Icons */
  farEnvelope = faEnvelope;
  farUser = faUser;
  fasAngleDoubleUp = faAngleDoubleUp;
  fasHashtag = faHashtag;
  fasInfoCircle = faInfoCircle;

  /* Messages */
  msgError: string;
  msgTableBody: string;
  errorMsg: boolean = false;
  okMsg: boolean = false;

  /* Models */
  allocatedVouchersDTO: VoucherDTO[] = new Array();
  allocationsDTO: VoucherAllocationDTO[] = new Array();
  selectedMerchants: MerchantDTO[] = new Array();
  vouchers: VoucherDTO[] = new Array();
  merchants: MerchantDTO[];

  /* Pagination */
  selectedPage: number = 1;
  selectedPageVoucherAvailable: number = 1;

  /* Statuses */
  tableError: boolean = false;
  tableLoading: boolean = false;
  tableVouchersEmpty: boolean = false;
  tableVouchersAvailableEmpty: boolean = false;
  allocationOk: boolean = true;

  /* Models */
  empVouchers: VoucherDTO[] = new Array();
  empVouchersSelected: VoucherDTO[] = new Array();
  empVouchersInPage: VoucherDTO[] = new Array();
  dtoList: DTOList<VoucherDTO>;
  empVouchersSelectedToRedeem: VoucherDTO[] = new Array();

  /* Vouchers quantity selected */
  quantitySelected: number;
  vouQuantitySelected = {};
  totalActiveImport: number;

  /* Array Totals */
  vouImportsInPage: number[] = new Array();

  /* Import Totals */
  vouSelectedTotalPreview: number = 0;
  vouSelectedTotal: number = 0;



  constructor(
    private authenticatorService: AuthenticationService,
    private empShowMrcService: EmpShowMerchantsService,
    private empVouchersService: EmpVouchersService,
    private route: Router,
    private translatorService: TranslateService,
    private modalManager: ModalsManagerService,
    public validator: ValidatorService
  ) {
    if (
      this.route.getCurrentNavigation() !== null &&
      this.route.getCurrentNavigation().extras.state !== undefined
    ) {
      this.selectedMerchants = this.route.getCurrentNavigation().extras.state.mrcSelected

      /* Assign selected employees to an array */
      this.selectedMerchants = Array.from(
        this.route.getCurrentNavigation().extras.state.mrcSelected
      );


    } else {
      this.route.navigate(['employee/empDashboard']);
    }



    /* Add Italian locale, used to format currency and date (default is 'en-US') */
    registerLocaleData(localeIt, 'it-IT');
  }

  ngOnDestroy(): void {
    this.hideBootstrapTooltips();
    this.resetErrorModal();
  }

  ngOnInit(): void {
    this.showVouchersList();

    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });
  }

  /* Reset and hide error modal */
  resetErrorModal() {
    $('#modal-errors-header-title').html('');
    $('#modal-errors-body').html('');
    $('#modal-errors-footer-button').html('');

    $('#modal-errors').modal('hide');
  }


  /* Hide Bootstrap Tooltips, usually when switching component/page */
  hideBootstrapTooltips() {
    $(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  /* Calculate the active total import */
  calculateTotalActiveImport() {
    this.totalActiveImport = 0;

    this.empVouchersSelected.forEach((vch) => {
      this.totalActiveImport += Number(vch.vchValue) * Number(vch.vchQuantity);
    });
  }

  /* Round value with 2 decimals*/
  parseFloatStringValue(value: string) {
    return parseFloat(value).toFixed(2);
  }

  /* Round value */
  parseIntStringValue(value: string) {
    return parseInt(value);
  }

  /* Fill the vouchers selected table */
  showVouchersList() {
    /* Show loading spinner */
    this.tableLoading = true;

    /* Get employees list from rest service */
    this.empVouchersService.getExpendableVouchersEmp().subscribe(
      (response) => {
        /* Hide loading spinner */
        this.tableLoading = false;

        if (response.status === 'OK') {

          /* Assign response to a DTOList variable */
          this.dtoList = response;

          /* Assign response list to an array of EmployeesDTO */
          this.empVouchers = response.list;

          /* Check whether array is empty or not */
          if (!Array.isArray(this.empVouchers) || !this.empVouchers.length) {
            /* Show empty list message in table body */
            this.msgTableBody = this.translatorService.instant(
              'TABLES.VOUCHERS.EMPTY_TABLE'
            );

            this.tableVouchersAvailableEmpty = true;
          } else {
            this.tableVouchersAvailableEmpty = false;

            this.calculateTotalActiveImport();
          }
        } else {
          this.msgTableBody = this.translatorService.instant('ERRORS.GENERIC');
          this.tableVouchersAvailableEmpty = true;
        }
      },
      (error) => {
        /* TODO: Gestire errori con il metodo subscribe */
        /* Show error message in table body in case of no specific HTTP error ('Generic Error') */
        this.msgTableBody = this.translatorService.instant('ERRORS.GENERIC');

        this.tableLoading = false;
        this.tableVouchersAvailableEmpty = true;
        this.tableError = true;
      }
    );
  }

  /* Click Checkbox */
  onSingleVoucherSelected(vchNameFromHtml) {
    let arrChecked: VoucherDTO[] = new Array();
    let arrNotChecked: VoucherDTO[] = new Array();
    let obInitValue = {};

    /* Loop on the checked checkbox */
    $('#emp-invoice-vouchers tbody>tr')
      .has('input:checkbox:checked')
      .each(function () {
        $(this).find('td:eq(4)').children().prop('disabled', false);
        if (vchNameFromHtml === $(this).find('td:eq(1)').children().val()) {
          $(this).find('td:eq(4)').children().val(1);
        }

        let vchDto: VoucherDTO = new VoucherDTO();
        vchDto.vchName = $(this).find('td:eq(1)').children().val();
        vchDto.vchEndDate = $(this).find('td:eq(3)').text();
        vchDto.vchQuantity = $(this).find('td:eq(4)').children().val();
        vchDto.vchValue = $(this).find('td:eq(2)').children().val();
        arrChecked.push(vchDto);
        $(this).find('td:eq(4)').children()[0].dispatchEvent(new Event('change'));

        obInitValue[vchDto.vchName] = vchDto.vchValue;
      });

    /* Loop on the unchecked checkbox */
    $('#emp-invoice-vouchers tbody>tr')
      .has('input:checkbox:not(:checked)')
      .each(function () {
        $(this).find('td:eq(4)').children().prop('disabled', true);
        $(this).find('td:eq(4)').children().val(0);
        let vchDto: VoucherDTO = new VoucherDTO();
        vchDto.vchName = $(this).find('td:eq(1)').children().val();
        vchDto.vchEndDate = $(this).find('td:eq(3)').text();
        vchDto.vchQuantity = $(this).find('td:eq(4)').children().val();
        vchDto.vchValue = $(this).find('td:eq(2)').children().val();

        arrNotChecked.push(vchDto);
        delete obInitValue[vchDto.vchName];
      });

    /* Put the checked checkbox to Array */
    arrChecked.forEach((element) => {
      if (
        !this.empVouchersInPage.find((el) => el.vchName === element.vchName)
      ) {
        this.empVouchersInPage.push(element);
      }
    });

  /* Remove the unchecked checkbox from Array */
    this.empVouchersInPage.forEach((element, index) => {
      if (arrNotChecked.find((el) => el.vchName === element.vchName)) {
        this.empVouchersInPage.splice(index, 1);
      }
    });

    /* Remove quantity from total imports object */
    arrNotChecked.forEach(element => {
      if (this.vouQuantitySelected.hasOwnProperty(element.vchName)) {
        this.vouSelectedTotalPreview -= (this.vouQuantitySelected[element.vchName]);
        delete this.vouQuantitySelected[element.vchName];
      }
    });

    this.empVouchersSelected = arrChecked;

    this.calculateTotalActiveImport();

    /* Adds intial value to vouchers */
    for (const key in obInitValue) {
      if (!(key in this.vouQuantitySelected)) {
        this.vouQuantitySelected[key] = parseFloat(obInitValue[key]);
        this.vouSelectedTotalPreview += parseFloat(obInitValue[key]);
        this.vouImportsInPage.push(this.vouSelectedTotalPreview);
      }
    }

  }

  /* Remove selection */
  onKillVouchersSelection() {
    this.empVouchersSelected = [];
    this.empVouchersInPage = [];
    $('#emp-invoice-vouchers input[type=checkbox]').prop(
      'checked',
      false
    );
    this.tableVouchersEmpty = true;
  }

  /* Show list of selected merchants */
  onClickShowSelectedMerchants() {
    $('#emp-vouchers-modal-merchants').modal('show');
  }

   /* Add VoucherDTO to Array */
  addAllocatedVouchersDTO(voucher: VoucherDTO) {
    let voucherDTO: VoucherDTO = new VoucherDTO();

    voucherDTO.vchName = voucher.vchName;
    voucherDTO.vchQuantity = voucher.vchQuantity;
    this.allocatedVouchersDTO.push(voucherDTO);
  }

  /* Add VoucherAllocationDTO to Array */
  addVoucherAllocationDTO(vouchers: VoucherDTO[], merchant: MerchantDTO) {
    let allocationDTO: VoucherAllocationDTO = new VoucherAllocationDTO();

    allocationDTO.fromId = this.authenticatorService.getLoggedUserId();
    allocationDTO.profile = 'employee';
    allocationDTO.toId = merchant.usrId;
    allocationDTO.voucherList = vouchers;
    this.allocationsDTO.push(allocationDTO);

  }

  /* Submit Allocation */
  onClickConfirmAllocation() {
    /* Show loading button */
    this.allocationOk = false;

    $('#emp-vouchers-alloc-btn-x').prop('disabled', true);
    $('#modal-canc-footer-button').prop('disabled', true);

    /* Add selected vouchers to a VouchersDTO array */
    this.empVouchersSelectedToRedeem.forEach((vch) => this.addAllocatedVouchersDTO(vch));

    /* Add selected employees to a VoucherAllocationDTO array */
    this.selectedMerchants.forEach((emp) => {
      this.addVoucherAllocationDTO(this.allocatedVouchersDTO, emp);
    });



    /* Use the rest service to allocate the selected vouchers */
    this.empVouchersService.allocateVouchers(this.allocationsDTO).subscribe(
      (response) => {


        if (response.status === 'OK') {
          setTimeout(() => {

            this.allocationOk = true;
            this.okMsg = true;

            $('#emp-vouchers-alloc-btn-x').prop('disabled', false);
          }, environment.empTimeout);
        } else {
          this.allocationOk = true;
          this.errorMsg = true;

          $('#emp-vouchers-alloc-btn-x').prop('disabled', false);
          /* Show error message */
        }
      }, (error) => {
        this.allocationOk = true;
        $('#emp-vouchers-alloc-btn-x').prop('disabled', false);

        this.errorMsg = true;

      }
    );
  }

  closeModal() {
    /* Hide modal */
    $('#modal-canc-footer-button').prop('disabled', false);
    $('#emp-vouchers-modal-allocation').modal("hide");
    if (this.okMsg = true) {
      this.route.navigate(['employee/empDashboard/wallet']);
    }

  }

  /* Voucher Allocation Button click shows modal */
  onClickVoucherAllocation() {
    /* Control whether any voucher has been selected */
    if (this.empVouchersSelected.length) {
      let modalBuyVoucher = $('#emp-vouchers-modal-allocation');

      /* Show Buy Voucher Summary Modal */
      modalBuyVoucher.modal('show');

      this.empVouchersSelectedToRedeem = [];
      /* Creates a list of vouchers to redeem */
      this.empVouchersInPage.forEach(element => {
        let vchDto: VoucherDTO = new VoucherDTO();
        vchDto.vchName = element.vchName;
        vchDto.vchEndDate = element.vchEndDate;
        vchDto.vchValue = element.vchValue;
        vchDto.vchQuantity = this.quantitySelectedToMultiply(element.vchName, element.vchValue).toString();
        this.empVouchersSelectedToRedeem.push(vchDto);

      });
    } else {
      /* Show Errors Modal */
      this.modalManager.errorsModalGeneric(
        'MODALS.HEADER.VOUCHERS.ERRORS.VOUCHERS_ALLOCATION_TITLE',
        'MODALS.BODY.VOUCHERS.ERRORS.VOUCHERS_ALLOCATION_BODY'
      );
    }
  }


  /* Ngx-pagination pages change event: Voucher Modal */
  onPageChange() {
    setTimeout(() => {
      this.empVouchersInPage.forEach((vch) => {
        $('#emp-invoice-vouchers tbody>tr').each(function () {
          if (vch.vchName === $(this).find('td:eq(1)').children().val()) {
            $(this).find('input:checkbox').prop('checked', true);
          }
        });
      });
      /* $('#emp-invoice-vouchers tbody>tr').has('input:checkbox:checked').find('#emp-invoice-modal-qselector').prop('disabled', false); */
      let obSelection = { ...this.vouQuantitySelected };
      $('#emp-invoice-vouchers tbody>tr').each(function () {
        for (const key in obSelection) {
          if ($(this).find('td:eq(1)').children().val() === key) {
            $(this)
              .find('#emp-invoice-modal-qselector')
              .val(
                obSelection[key] / parseFloat($(this).find('td:eq(2)').children().val())
              )
              .change();
          }
        }
      });

      $('#emp-invoice-vouchers tbody>tr')
        .has('input:checkbox:checked')
        .find('#emp-invoice-modal-qselector')
        .prop('disabled', false);
    }, 1);
  }


  /* Returns the import of voucher selected */
  quantitySelectedToMultiply(vchName, vchValue) {
    let res = 0;
    if (this.vouQuantitySelected.hasOwnProperty(vchName)) {
      res = this.vouQuantitySelected[vchName] / vchValue;
    }
    else {
      res = 0;
    }
    return res;
  }

  /* Saves quantity of vouchers selected in an object */
  getQuantitySelected(event, vchName, vchValue, vchQuantity) {

    /* Checks if the input is grater or smaller than availability */
    if (parseInt(event.target.value) > parseInt(vchQuantity)) {
      this.quantitySelected = vchQuantity * parseFloat(vchValue);

      /* Sets the input to max quantity available */
      $('#emp-invoice-vouchers tbody>tr').each(function () {
        if ($(this).find('td:eq(1)').children().val() === vchName) {

          event.target.value = vchQuantity;
        }
      });

      this.modalManager.errorsModalGeneric(
        'MODALS.HEADER.INVOICES.ERRORS.VOUCHERS_WRONG_INPUT',
        'MODALS.BODY.INVOICES.ERRORS.VOUCHERS_MAX'
      );
    } else if (parseInt(event.target.value) < 1) {
      this.quantitySelected = 1 * parseFloat(vchValue);

      /* Sets the input to 1 */
      $('#emp-invoice-vouchers tbody>tr').each(function () {
        if ($(this).find('td:eq(1)').children().val() === vchName) {

          event.target.value = 1;
        }
      });

      this.modalManager.errorsModalGeneric(
        'MODALS.HEADER.INVOICES.ERRORS.VOUCHERS_WRONG_INPUT',
        'MODALS.BODY.INVOICES.ERRORS.VOUCHERS_MIN'
      );
    } else {
      this.quantitySelected = event.target.value * parseFloat(vchValue);
    }

    this.vouQuantitySelected[vchName] = this.quantitySelected;

    /* Copies all values selected in array */
    this.vouImportsInPage = Object.values(this.vouQuantitySelected);
    this.vouSelectedTotalPreview = this.vouImportsInPage.reduce((x, y) => x + y);
  }


  showQuantityAvailable(vchName) {
    let arrQuantityAvailable: number[] = new Array();
    this.empVouchers.forEach(element => {
      if (element.vchName === vchName) {
        for (let index = 1; index <= (parseInt(element.vchQuantity)); index++) {
          arrQuantityAvailable.push(index);
        }
      }
    });
    return arrQuantityAvailable;
  }
}
