/* --- DEFAULTS IMPORTS --- */
import { Component, OnDestroy, OnInit } from '@angular/core';

/* vvv CUSTOM IMPORTS vvv */
//#region

/* Environment */
import { environment } from 'src/environments/environment';

/* FontAwesome */
import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleDoubleLeft,
  faAngleDoubleUp,
  faHashtag,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

/* jQuery */
declare var $: any;

/* Locales */
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';

/* Models */
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { VoucherDTO } from 'src/app/model/voucher-dto';

/* Router */
import { Router } from '@angular/router';

/* Services */
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CpyVouchersService } from '../../services/rest/cpy-vouchers.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/services/validator.service';
import { VoucherAllocationDTO } from 'src/app/model/voucher-allocation-dto';

//#endregion
/* ^^^ CUSTOM IMPORTS ^^^ */

@Component({
  selector: 'app-cpy-vouchers',
  templateUrl: './cpy-vouchers.component.html',
  styleUrls: ['./cpy-vouchers.component.css'],
})
export class CpyVouchersComponent implements OnDestroy, OnInit {
  /* vvv ATTRIBUTES vvv */
  //#region

  /* FontAwesome Icons */
  farEnvelope = faEnvelope;
  farUser = faUser;
  fasAngleDoubleLeft = faAngleDoubleLeft;
  fasAngleDoubleUp = faAngleDoubleUp;
  fasHashtag = faHashtag;
  fasInfoCircle = faInfoCircle;

  /* Messages */
  msgTableBody: string;
  errorMsg: boolean = false;
  okMsg: boolean = false;

  /* Models */
  allocatedVouchersDTO: VoucherDTO[] = new Array();
  allocationsDTO: VoucherAllocationDTO[] = new Array();
  selectedEmployees: EmployeeDTO[] = new Array();
  selectedVouchers: Set<VoucherDTO> = new Set();
  vouchers: VoucherDTO[] = new Array();

  /* Pagination */
  selectedPage: number = 1;

  /* Statuses */
  allocationOk: boolean = true;
  tableEmpty: boolean = false;
  tableError: boolean = false;
  tableLoading: boolean = false;

  /* Values */
  selectedQuantities: Map<string, number> = new Map();
  totalImport: number;
  voucherImports: Map<string, number> = new Map();

  //#endregion
  /* ^^^ ATTRIBUTES ^^^ */

  constructor(
    private authenticatorService: AuthenticationService,
    private cpyVouchersService: CpyVouchersService,
    private modalManager: ModalsManagerService,
    private router: Router,
    private translatorService: TranslateService,
    public validatorService: ValidatorService
  ) {
    /* Control whether the router navigation has an object containing the selected employees */
    if (
      this.router.getCurrentNavigation() !== null &&
      this.router.getCurrentNavigation().extras.state !== undefined
    ) {
      /* Assign selected employees to an array */
      this.selectedEmployees = Array.from(
        this.router.getCurrentNavigation().extras.state.checkedEmps
      );
    } else {
      /* Redirect to Dashboard */
      this.router.navigate(['company/cpyDashboard/']);
    }

    /* Add Italian locale, used to format currency and date (default is 'en-US') */
    registerLocaleData(localeIt, 'it-IT');
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.checkboxClickCheckAll();
    this.showActiveVouchers();
  }

  /* vvv METHODS vvv */
  //#region

  /* Add selected vouchers to an allocated VouchersDTO array */
  addAllocatedVouchersDTO(voucher: VoucherDTO) {
    let voucherDTO: VoucherDTO = new VoucherDTO();

    voucherDTO.vchName = voucher.vchName;
    voucherDTO.vchQuantity = this.selectedQuantities
      .get(
        this.idifyVoucherValueAndEndDate(voucher.vchValue, voucher.vchEndDate)
      )
      .toString();

    this.allocatedVouchersDTO.push(voucherDTO);
  }

  /* Add selected vouchers and employees to an AllocationDTO array */
  addVoucherAllocationDTO(vouchers: VoucherDTO[], employee: EmployeeDTO) {
    let allocationDTO: VoucherAllocationDTO = new VoucherAllocationDTO();

    allocationDTO.fromId = this.authenticatorService.getLoggedUserId();
    allocationDTO.profile = 'company';
    allocationDTO.toId = employee.usrId;
    allocationDTO.voucherList = vouchers;

    this.allocationsDTO.push(allocationDTO);
  }

  /* Calculate imports and add selected vouchers and quantities to relative Set() objects (used for keeping tracks of their values) */
  calculateVoucherImport(id: string, voucher: VoucherDTO) {
    let vchCheckbox = $('#cpy-vouchers-voucher-checkbox-' + id);
    let vchQuantity = $('#cpy-vouchers-voucher-quantity-' + id).val();
    let vchValue = $('#cpy-vouchers-voucher-value-' + id).val();

    if (vchCheckbox.prop('checked')) {
      let vchImport = Number(vchValue) * Number(vchQuantity);

      this.selectedQuantities.set(id, vchQuantity);
      this.voucherImports.set(id, vchImport);

      this.selectedVouchers.add(voucher);
    } else {
      this.selectedQuantities.set(id, 0);
      this.voucherImports.set(id, 0);

      this.selectedVouchers.delete(voucher);
    }

    this.calculateTotalImport();
  }

  /* Calculate the total import */
  calculateTotalImport() {
    let vchImportsArray = Array.from(this.voucherImports.values());

    this.totalImport = vchImportsArray.reduce((pV, cV) => {
      return pV + cV;
    });
  }

  /* Checkbox 'Check-All' is checked if every other checkbox is checked */
  checkboxCheckControl() {
    if (
      $('input:checkbox').not('#cpy-vouchers-check-all').not(':checked')
        .length === 0
    ) {
      $('#cpy-vouchers-check-all').prop('checked', true);
    } else {
      $('#cpy-vouchers-check-all').prop('checked', false);
    }
  }

  /* Allow checkbox 'cpy-vouchers-check-all' to check and uncheck all other checkboxes */
  checkboxClickCheckAll() {
    /* Assign onClick event to check all checkboxes, then trigger 'change' event of every single quantity input and toggle them on/off */
    $('#cpy-vouchers-check-all').click(function () {
      $('input:checkbox').prop('checked', this.checked);
      $('input[type="number"]').each(function () {
        /* Toggle voucher quantity input based on relative checkbox */
        if (
          $('input:checkbox[id*="' + $(this)[0].id.split('-').pop() + '"]').is(
            ':checked'
          )
        ) {
          $(this).prop('disabled', false);
        } else {
          $(this).prop('disabled', true);
        }

        /* Trigger change event of the relative quantity input */
        $(this)[0].dispatchEvent(new Event('input'));
      });
    });
  }

  /* Convert the Voucher Value and EndDate in a ID-like format (used to identify relatives inputs, values, etc. of a voucher) */
  idifyVoucherValueAndEndDate(vchValue: string, vchEndDate: string): string {
    return vchValue.replace(/\./g, '').concat(vchEndDate.replace(/\-/g, ''));
  }

  /* Force Voucher Quantity to be within the minimum and maximum value */
  lockMinAndMaxVoucherQuantity(id: string) {
    let vchCurrentQuantity = $('#cpy-vouchers-voucher-quantity-' + id).val();
    let vchMaxQuantity = $('#cpy-vouchers-voucher-quantity-' + id).attr('max');
    let vchMinQuantity = $('#cpy-vouchers-voucher-quantity-' + id).attr('min');
    let vchQuantityInput = $('#cpy-vouchers-voucher-quantity-' + id);

    /* If multiple employees have been selected, the max quantity should be reduced (rounded down) */
    let maxQuantityRatio = Math.floor(
      vchMaxQuantity / this.selectedEmployees.length
    );

    /* Lock value only if quantity input isn't disabled */
    if (!vchQuantityInput.prop('disabled')) {
      /* Lock current quantity to the maximum */
      if (Number(vchCurrentQuantity) > Number(maxQuantityRatio)) {
        vchQuantityInput.val(maxQuantityRatio);

        if (this.selectedEmployees.length > 1) {
          this.modalManager.errorsModalGeneric(
            'MODALS.HEADER.GENERIC.ERRORS.VOUCHERS_WRONG_INPUT_TITLE',
            'MODALS.BODY.GENERIC.ERRORS.VOUCHERS_WRONG_MAX_EMPLOYEES_INPUT_BODY',
            maxQuantityRatio
          );
        } else {
          this.modalManager.errorsModalGeneric(
            'MODALS.HEADER.GENERIC.ERRORS.VOUCHERS_WRONG_INPUT_TITLE',
            'MODALS.BODY.GENERIC.ERRORS.VOUCHERS_WRONG_MAX_INPUT_BODY'
          );
        }
      }

      /* Lock current quantity to the minimum (should be 1) */
      if (
        Number(vchCurrentQuantity) < Number(vchMinQuantity) ||
        Number(vchCurrentQuantity) < 1
      ) {
        vchQuantityInput.val('1');

        this.modalManager.errorsModalGeneric(
          'MODALS.HEADER.GENERIC.ERRORS.VOUCHERS_WRONG_INPUT_TITLE',
          'MODALS.BODY.GENERIC.ERRORS.VOUCHERS_WRONG_MIN_INPUT_BODY'
        );
      }
    }
  }


  /* Reset selected vouchers values */
  resetSelectedValues() {
    /* Clear selected vouchers VoucherDTO array */
    this.allocatedVouchersDTO = [];

    /* Clear created allocations VoucherAllocationDTO array */
    this.allocationsDTO = [];

    /* Clear selected quantities */
    this.selectedQuantities.clear();

    /* Clear selected vouchers */
    this.selectedVouchers.clear();

    /* Clear total import */
    this.totalImport = 0;

    /* Clear vouchers imports */
    this.voucherImports.clear();

    /* Clear active vouchers list */
    this.vouchers = [];
  }

  /* Fill the vouchers table */
  showActiveVouchers() {
    /* Show loading spinner */
    this.tableLoading = true;

    /* Get vouchers list from rest service */
    this.cpyVouchersService.showActiveVouchers().subscribe(
      (response) => {
        /* Hide loading spinner */
        this.tableLoading = false;

        if (response.status === 'OK') {
          /* Assign response list to an array of VouchersDTO */
          this.vouchers = response.list.filter(
            (vch) =>
              Math.floor(
                Number(vch.vchQuantity) / this.selectedEmployees.length
              ) >= 1
          );

          if (this.vouchers.length !== response.list.length) {
            this.modalManager.infoModalGeneric(
              'MODALS.HEADER.VOUCHERS.GENERIC.LIMITED_QUANTITY_TITLE',
              'MODALS.BODY.VOUCHERS.GENERIC.LIMITED_QUANTITY_BODY'
            );
          }

          /* Check whether array is empty or not */
          if (!Array.isArray(this.vouchers) || !this.vouchers.length) {
            /* Show empty list message in table body */
            this.msgTableBody = this.translatorService.instant(
              'TABLES.VOUCHERS.EMPTY_TABLE'
            );

            this.tableEmpty = true;
          } else {
            this.tableEmpty = false;

            /* Calculate vouchers imports (should be zero on page init) */
            this.vouchers.forEach((vch) => {
              this.calculateVoucherImport(
                this.idifyVoucherValueAndEndDate(vch.vchValue, vch.vchEndDate),
                vch
              );
            });
          }
        } else {
          /* Show error message in active vouchers table body in case of no specific HTTP error ('Generic Error') */
          this.msgTableBody = this.translatorService.instant('ERRORS.GENERIC');

          this.tableLoading = false;
          this.tableEmpty = true;
          this.tableError = true;
        }
      },
      (error) => {
        /* Show error message in active vouchers table body in case of no specific HTTP error ('Generic Error') */
        this.msgTableBody = this.translatorService.instant('ERRORS.GENERIC');

        this.tableLoading = false;
        this.tableEmpty = true;
        this.tableError = true;
      }
    );
  }

  /* vvv EVENTS vvv */
  //#region

  /* Control quantity value and calculate imports when changing quantity */
  onChangeVoucherQuantity(voucher: VoucherDTO) {
    let vchId = this.idifyVoucherValueAndEndDate(
      voucher.vchValue,
      voucher.vchEndDate
    );

    /* Reset quantity to max value if superior */
    this.lockMinAndMaxVoucherQuantity(vchId);

    /* Calculate vouchers imports */
    this.calculateVoucherImport(vchId, voucher);
  }

  /* Confirm allocation operation */
  onClickConfirmAllocation() {

    /* Show loading button */
    this.allocationOk = false;

    /* Add selected vouchers to a VouchersDTO array */
    this.selectedVouchers.forEach((vch) => this.addAllocatedVouchersDTO(vch));

    /* Add selected employees to a VoucherAllocationDTO array */
    this.selectedEmployees.forEach((emp) => {
      this.addVoucherAllocationDTO(this.allocatedVouchersDTO, emp);
    });

    /* Use the rest service to allocate the selected vouchers */
    this.cpyVouchersService.allocateVouchers(this.allocationsDTO).subscribe(
      (response) => {
        if (response.status === 'OK') {
          setTimeout(() => {
            /* Hide loading button */
            this.allocationOk = true;
            this.okMsg = true;
          }, environment.walletDelay);
        } else {
          /* Hide loading button */
          this.allocationOk = true;
          this.errorMsg = true;
        }
      },
      (error) => {
        /* Hide loading button */
        this.allocationOk = true;
        this.errorMsg = true;
      }
    );
  }

  closeModal() {
    $('#cpy-vouchers-modal-allocation').modal('hide');
    if (this.okMsg = true) {
      this.router.navigate(['company/cpyDashboard/wallet']);
    }
   }


  /* Show list of selected employees */
  onClickShowSelectedEmployees() {
    $('#cpy-vouchers-modal-employees').modal('show');
  }

  /* Voucher Allocation Button click shows modal */
  onClickVoucherAllocation() {
    /* Control whether any voucher has been selected */
    if (this.selectedVouchers.size) {
      let modalBuyVoucher = $('#cpy-vouchers-modal-allocation');

      modalBuyVoucher.modal({ backdrop: 'static', keyboard: false });

      /* Show Buy Voucher Summary Modal */
      modalBuyVoucher.modal('show');
    } else {
      /* Show Errors Modal */
      this.modalManager.errorsModalGeneric(
        'MODALS.HEADER.VOUCHERS.ERRORS.VOUCHERS_ALLOCATION_TITLE',
        'MODALS.BODY.VOUCHERS.ERRORS.VOUCHERS_ALLOCATION_BODY'
      );
    }
  }

  /* Control checkboxes statuses, toggle on/off quantity input and 'trigger' change event on it when clicking on a checkbox */
  onClickVoucherCheckbox(voucher: VoucherDTO) {
    /* Control whether all checkboxes are checked or not */
    this.checkboxCheckControl();

    let vchQuantityInput = $(
      '#cpy-vouchers-voucher-quantity-' +
        this.idifyVoucherValueAndEndDate(voucher.vchValue, voucher.vchEndDate)
    );

    /* Toggle on/off voucher quantity input */
    vchQuantityInput.prop('disabled', function (i, v) {
      return !v;
    });

    /* Change quantity value to zero if it's disabled */
    if (vchQuantityInput.prop('disabled')) {
      vchQuantityInput.val('0');
    } else {
      vchQuantityInput.val(
        this.selectedQuantities.get(
          this.idifyVoucherValueAndEndDate(voucher.vchValue, voucher.vchEndDate)
        ) || '1'
      );
    }

    /* Trigger change event of the relative quantity input */
    vchQuantityInput[0].dispatchEvent(new Event('input'));
  }

  /* Ngx-pagination page change event */
  onPageChange() {
    /* Need a little timeout when changing page with pagination, otherwise changes will be applied to previous page */
    setTimeout(() => {
      /* Keep selected quantities saved when switching page. */
      this.selectedQuantities.forEach((quantity, id) => {
        $('#cpy-vouchers-voucher-quantity-' + id).each(function () {
          $(this).val(quantity);
        });
      });

      /* Convert selected vouchers Set() into an Array with only vouchers IDs */
      let selVchArray = Array.from(this.selectedVouchers).map((vch) =>
        this.idifyVoucherValueAndEndDate(vch.vchValue, vch.vchEndDate)
      );

      /* Control whether the voucher was previously selected, then check the relative checkbox and trigger the click event. */
      $('input:checkbox').each(function () {
        if (selVchArray.includes($(this).val())) {
          /* Check the relative checkbox */
          $(this).prop('checked', true);

          /* Trigger click event of the relative checkbox */
          $(this)[0].dispatchEvent(new Event('click'));
        }
      });

      /* Control whether all checkboxes are checked or not */
      this.checkboxCheckControl();
    }, 1);
  }

  //#endregion
  /* ^^^ EVENTS ^^^ */

  //#endregion
  /* ^^^ METHODS ^^^ */
}
