/* --- DEFAULTS IMPORTS --- */
import { Component, OnDestroy, OnInit } from '@angular/core';

/* vvv CUSTOM IMPORTS vvv */
//#region

/* Environment */
import { environment } from 'src/environments/environment';

/* FontAwesome */
import {
  faExclamationCircle,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';

/* jQuery */
declare var $: any;

/* Locales */
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';

/* Models */
import { VoucherDTO } from 'src/app/model/voucher-dto';

/* Router */
import { Router } from '@angular/router';

/* Services */
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CpyVouchersService } from '../../services/rest/cpy-vouchers.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/services/validator.service';

//#endregion
/* ^^^ CUSTOM IMPORTS ^^^ */

@Component({
  selector: 'app-cpy-wallet',
  templateUrl: './cpy-wallet.component.html',
  styleUrls: ['./cpy-wallet.component.css'],
})
export class CpyWalletComponent implements OnDestroy, OnInit {
  /* vvv ATTRIBUTES vvv */
  //#region

  /* FontAwesome */
  fasExclamationCircle = faExclamationCircle;
  fasSyncAlt = faSyncAlt;

  /* Messages */
  activeTableBodyMessage: string;
  purchasableTableBodyMessage: string;

  /* Models */
  activeVouchers: VoucherDTO[] = new Array();
  purchasableVouchers: VoucherDTO[] = new Array();
  purchasedVouchersDTO: VoucherDTO[] = new Array();
  selectedPurchasableVouchers: Set<VoucherDTO> = new Set();

  /* Pagination */
  activePage: number = 1;
  purchasablePage: number = 1;

  /* Statuses */
  activeTableEmpty: boolean = false;
  activeTableError: boolean = false;
  activeTableLoading: boolean = false;
  newVoucherOk: boolean = true;
  newVoucherQuantityOk: boolean = true;
  newVoucherValueOk: boolean = true;
  purchasableTableEmpty: boolean = false;
  purchasableTableError: boolean = false;
  purchasableTableLoading: boolean = false;
  purchaseOk: boolean = true;

  /* Values */
  purchasableVoucherImports: Map<string, number> = new Map();
  selectedPurchasableQuantities: Map<string, number> = new Map();
  totalActiveImport: number;
  totalPurchasableImport: number;

  /* Success or Error alerts */
  successNewVoucher: boolean = false;
  errorNewVoucher: boolean = false;
  successBuyVoucher: boolean = false;
  errorBuyVoucher: boolean = false;

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
    /* Add Italian locale, used to format currency and date (default is 'en-US') */
    registerLocaleData(localeIt, 'it-IT');
  }

  ngOnDestroy(): void {
    this.modalManager.errorsModalReset();
    this.modalManager.infoModalReset();
    this.modalManager.successModalReset();

    $(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  ngOnInit(): void {
    this.checkboxClickPurchasableCheckAll();
    this.showActiveVouchers();
    this.showPurchasableVouchers();

    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });
  }

  /* vvv METHODS vvv */
  //#region

  /* Add selected purchasable vouchers to a VoucherDTO array */
  addSelectedVouchersDTO(voucher: VoucherDTO) {
    let voucherDTO: VoucherDTO = new VoucherDTO();

    voucherDTO.companyId = this.authenticatorService.getLoggedUserId();
    voucherDTO.vchCreationDate = voucher.vchCreationDate;
    voucherDTO.vchEndDate = voucher.vchEndDate;
    voucherDTO.vchName = voucher.vchName;
    voucherDTO.vchQuantity = this.selectedPurchasableQuantities
      .get(
        this.idifyVoucherValueAndEndDate(voucher.vchValue, voucher.vchEndDate)
      )
      .toString();
    voucherDTO.vchValue = voucher.vchValue;

    this.purchasedVouchersDTO.push(voucherDTO);
  }

  /* Calculate imports and add selected vouchers and quantities to relative Set() objects (used for keeping tracks of their values) */
  calculatePurchasableVoucherImport(id: string, voucher: VoucherDTO) {
    let vchCheckbox = $('#cpy-wallet-purchasable-voucher-checkbox-' + id);
    let vchQuantity = $('#cpy-wallet-purchasable-voucher-quantity-' + id).val();
    let vchValue = $('#cpy-wallet-purchasable-voucher-value-' + id).val();

    if (vchCheckbox.prop('checked')) {
      let vchImport = Number(vchValue) * Number(vchQuantity);

      this.selectedPurchasableQuantities.set(id, vchQuantity);
      this.purchasableVoucherImports.set(id, vchImport);

      this.selectedPurchasableVouchers.add(voucher);
    } else {
      this.selectedPurchasableQuantities.set(id, 0);
      this.purchasableVoucherImports.set(id, 0);

      this.selectedPurchasableVouchers.delete(voucher);
    }

    this.calculateTotalPurchasableImport();
  }

  /* Calculate the active total import */
  calculateTotalActiveImport() {
    this.totalActiveImport = 0;

    this.activeVouchers.forEach((vch) => {
      this.totalActiveImport += Number(vch.vchValue) * Number(vch.vchQuantity);
    });
  }

  /* Calculate the purchasable total import */
  calculateTotalPurchasableImport() {
    let vchImportsArray = Array.from(this.purchasableVoucherImports.values());

    this.totalPurchasableImport = vchImportsArray.reduce((pV, cV) => {
      return pV + cV;
    });
  }

  /* Allow purchasable 'Check-All' checkbox to check and uncheck all other checkboxes */
  checkboxClickPurchasableCheckAll() {
    /* Assign onClick event to check all checkboxes, then trigger 'change' event of every single quantity input and toggle them on/off */
    $('#cpy-wallet-purchasable-vouchers-check-all').click(function () {
      $('input:checkbox[id*="purchasable"]').prop('checked', this.checked);
      $('input[id*="purchasable"][type="number"]').each(function () {
        /* Toggle voucher quantity input based on relative checkbox */
        if (
          $('input:checkbox[id*="' + $(this)[0].id.split('-').pop() + '"]').is(
            ':checked'
          )
        ) {
          $(this).prop('disabled', false);
          $(this).val('1');
        } else {
          $(this).prop('disabled', true);
          $(this).val('0');
        }

        /* Trigger change event of the relative quantity input */
        $(this)[0].dispatchEvent(new Event('input'));
      });
    });
  }

  /* Checkbox 'check-all' is checked if every other checkbox is checked */
  checkboxPurchasableCheckControl() {
    if (
      $('input:checkbox[id*="purchasable"]')
        .not('#cpy-wallet-purchasable-vouchers-check-all')
        .not(':checked').length === 0
    ) {
      $('#cpy-wallet-purchasable-vouchers-check-all').prop('checked', true);
    } else {
      $('#cpy-wallet-purchasable-vouchers-check-all').prop('checked', false);
    }
  }

  /* Create a new VoucherDTO type */
  createNewVoucherDTO(): VoucherDTO {
    let voucherDTO: VoucherDTO = new VoucherDTO();

    let newVoucherQuantity = $('#cpy-wallet-modal-new-voucher-quantity').val();
    let newVoucherValue = $('#cpy-wallet-modal-new-voucher-value').val();

    voucherDTO.companyId = this.authenticatorService.getLoggedUserId();
    voucherDTO.vchQuantity = newVoucherQuantity;
    voucherDTO.vchValue = newVoucherValue;

    return voucherDTO;
  }

  /* Convert the Voucher Value in a ID-like format */
  idifyVoucherValueAndEndDate(vchValue: string, vchEndDate: string): string {
    return vchValue.replace(/\./g, '').concat(vchEndDate.replace(/\-/g, ''));
  }

  /* Force New Voucher Quantity to be within the minimum value */
  lockMinNewVoucherQuantity() {
    let vchCurrentQuantity = $('#cpy-wallet-modal-new-voucher-quantity').val();
    let vchMinQuantity = $('#cpy-wallet-modal-new-voucher-quantity').attr(
      'min'
    );
    let vchQuantityInput = $('#cpy-wallet-modal-new-voucher-quantity');

    if (
      Number(vchCurrentQuantity) < Number(vchMinQuantity) ||
      Number(vchCurrentQuantity) < 1
    ) {
      vchQuantityInput.val('1');

      this.newVoucherValueOk = true;
      this.newVoucherQuantityOk = false;

      setTimeout(() => {
        this.newVoucherQuantityOk = true;
      }, 5000);
    }
  }

  /* Force Voucher Quantity to be within the minimum value */
  lockMinPurchasableVoucherQuantity(id: string) {
    let vchCurrentQuantity = $(
      '#cpy-wallet-purchasable-voucher-quantity-' + id
    ).val();
    let vchMinQuantity = $(
      '#cpy-wallet-purchasable-voucher-quantity-' + id
    ).attr('min');
    let vchQuantityInput = $('#cpy-wallet-purchasable-voucher-quantity-' + id);

    /* Lock value only if quantity input isn't disabled */
    if (!vchQuantityInput.prop('disabled')) {
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

  /* TODO: Provare a adattarlo per multi uso (serve un po' di refactoring) */
  /* Force current value to be within the minimum value */
  lockMinValue(event) {
    let vchCurrentValue = event.target.value;
    let vchMinValue = event.target.min;
    let vchValueInput = event.target;

    if (
      Number(vchCurrentValue) < Number(vchMinValue) ||
      Number(vchCurrentValue) < 0.01
    ) {
      vchValueInput.value = 0.01;

      this.newVoucherQuantityOk = true;
      this.newVoucherValueOk = false;

      setTimeout(() => {
        this.newVoucherValueOk = true;
      }, 5000);
    }
  }

  /* Reset selected purchasable values */
  resetSelectedPurchasableValues() {
    /* Clear active vouchers list */
    this.activeVouchers = [];

    /* Clear purchasable vouchers list */
    this.purchasableVouchers = [];

    /* Clear selected purchasable imports */
    this.purchasableVoucherImports.clear();

    /* Clear selected purchasable VoucherDTO array */
    this.purchasedVouchersDTO = [];

    /* Clear selected purchasable quantities */
    this.selectedPurchasableQuantities.clear();

    /* Clear selected purchasable vouchers */
    this.selectedPurchasableVouchers.clear();

    /* Clear selected purchasable total import */
    this.totalPurchasableImport = 0;

    /* let chkCheckAll = $('#cpy-wallet-purchasable-vouchers-check-all'); */

    /* Trigger click event of Check-All checkbox */
    /* chkCheckAll.click(); */
  }

  /* Fill the active vouchers table */
  showActiveVouchers() {
    /* Empty transactions list */
    if (Array.isArray(this.activeVouchers) && this.activeVouchers.length) {
      this.activeVouchers = [];
    }

    /* Show loading spinner */
    this.activeTableLoading = true;

    /* Hide Empty Table Body */
    this.activeTableEmpty = false;

    /* Reset selected activeVouchers pagination page */
    this.activePage = 1;

    /* Get purchasable vouchers list from rest service */
    this.cpyVouchersService.showActiveVouchers().subscribe(
      (response) => {
        /* Hide loading spinner */
        this.activeTableLoading = false;

        if (response.status === 'OK') {
          /* Assign response list to an array of VouchersDTO */
          this.activeVouchers = response.list;

          /* Check whether array is empty or not */
          if (
            !Array.isArray(this.activeVouchers) ||
            !this.activeVouchers.length
          ) {
            /* Show empty list message in table body */
            this.activeTableBodyMessage = this.translatorService.instant(
              'TABLES.VOUCHERS.EMPTY_TABLE'
            );

            this.activeTableEmpty = true;
          } else {
            this.activeTableEmpty = false;

            this.calculateTotalActiveImport();
          }
        } else {
          /* Show error message in active vouchers table body in case of no specific error ('Generic Error') */
          this.activeTableBodyMessage = this.translatorService.instant(
            'ERRORS.GENERIC'
          );

          this.activeTableLoading = false;
          this.activeTableEmpty = true;
          this.activeTableError = true;
        }
      },
      (error) => {
        /* Show error message in active vouchers table body in case of no specific HTTP error ('Generic Error') */
        this.activeTableBodyMessage = this.translatorService.instant(
          'ERRORS.GENERIC'
        );

        this.activeTableLoading = false;
        this.activeTableEmpty = true;
        this.activeTableError = true;
      }
    );
  }

  /* Fill the purchasable vouchers table */
  showPurchasableVouchers() {
    /* Empty transactions list */
    if (
      Array.isArray(this.purchasableVouchers) &&
      this.purchasableVouchers.length
    ) {
      this.purchasableVouchers = [];
    }

    /* Show loading spinner */
    this.purchasableTableLoading = true;

    /* Hide Empty Table Body */
    this.purchasableTableEmpty = false;

    /* Reset selected purchasableVouchers pagination page */
    this.purchasablePage = 1;

    /* Get purchasable vouchers list from rest service */
    this.cpyVouchersService.showPurchasableVouchers().subscribe(
      (response) => {
        /* Hide loading spinner */
        this.purchasableTableLoading = false;

        /* Assign response list to an array of VouchersDTO */
        this.purchasableVouchers = response.list;

        /* Check whether array is empty or not */
        if (
          !Array.isArray(this.purchasableVouchers) ||
          !this.purchasableVouchers.length
        ) {
          /* Show empty list message in table body */
          this.purchasableTableBodyMessage = this.translatorService.instant(
            'TABLES.VOUCHERS.EMPTY_TABLE'
          );

          this.purchasableTableEmpty = true;
        } else {
          this.purchasableTableEmpty = false;

          /* Calculate vouchers imports (should be zero on page init) */
          this.purchasableVouchers.forEach((vch) => {
            this.calculatePurchasableVoucherImport(
              this.idifyVoucherValueAndEndDate(vch.vchValue, vch.vchEndDate),
              vch
            );
          });
        }
      },
      (error) => {
        /* Show error message in active vouchers table body in case of no specific HTTP error ('Generic Error') */
        this.purchasableTableBodyMessage = this.translatorService.instant(
          'ERRORS.GENERIC'
        );

        this.purchasableTableLoading = false;
        this.purchasableTableEmpty = true;
        this.purchasableTableError = true;
      },
      () => {
        /* Checkbox 'check-all' is checked if every other checkbox is checked */
        setTimeout(() => {
          this.checkboxPurchasableCheckControl();
        }, 1);
      }
    );
  }

  /* vvv EVENTS vvv */
  //#region

  /* Control max quantity and calculate imports when changing quantity */
  onChangePurchasableVoucherQuantity(voucher: VoucherDTO) {
    let vchId = this.idifyVoucherValueAndEndDate(
      voucher.vchValue,
      voucher.vchEndDate
    );

    /* Reset quantity to max value if superior */
    this.lockMinPurchasableVoucherQuantity(vchId);

    /* Calculate vouchers imports */
    this.calculatePurchasableVoucherImport(vchId, voucher);
  }

  /* Force voucher value to have two decimal points */
  onChangeVoucherValueDecimal(event) {
    event.target.value = parseFloat(event.target.value).toFixed(2);
  }

  /* Show purchase order summary modal */
  onClickBuyVoucher() {
    if (this.selectedPurchasableVouchers.size) {
      let modalBuyVoucher = $('#cpy-wallet-modal-buy-voucher');

      /* Show Buy Voucher Summary Modal */
      modalBuyVoucher.modal('show');
    } else {
      this.modalManager.errorsModalGeneric(
        'MODALS.HEADER.WALLET.ERRORS.BUY_VOUCHER_TITLE',
        'MODALS.BODY.WALLET.ERRORS.BUY_VOUCHER_BODY'
      );
    }
  }

  /* Confirm vouchers purchase order */
  onClickConfirmPurchase() {
    /* let modalBuyVoucher = $('#cpy-wallet-modal-buy-voucher'); */

    /* Show loading button */
    this.purchaseOk = false;

    /* Add selected purchasable vouchers to a VouchersDTO array */
    this.selectedPurchasableVouchers.forEach((vch) =>
      this.addSelectedVouchersDTO(vch)
    );

    /* Use the rest service to buy the selected vouchers */
    this.cpyVouchersService
      .purchaseVouchers(this.purchasedVouchersDTO)
      .subscribe(
        (response) => {
          if (response.status === 'OK') {
            this.successBuyVoucher = true;
          } else {
            this.errorBuyVoucher = true;
          }
        },
        (error) => {
          this.errorBuyVoucher = true;
        },
        () => {
          /* Reset selected purchasable values */
          this.resetSelectedPurchasableValues();

          /* Reload active and purchasable vouchers list */
          this.showActiveVouchers();
          this.showPurchasableVouchers();

          this.purchaseOk = true;
        }
      );
  }

  closeModalBuyVoucher() {
    $('#cpy-wallet-modal-buy-voucher').modal('hide');
    if (this.successBuyVoucher) {
      this.router.navigate(['company/cpyDashboard/orders']);
    }
    this.successBuyVoucher = false;
    this.errorBuyVoucher = false;
  }

  /* Confirm new voucher type creation */
  onClickCreateNewVoucher() {
    /* New Voucher Modal */

    /* Show loading button */
    this.newVoucherOk = false;

    /* Use the rest service to buy the selected vouchers */
    this.cpyVouchersService
      .createNewVoucherType(this.createNewVoucherDTO())
      .subscribe(
        (response) => {
          if (response.status === 'OK') {
            this.successNewVoucher = true;
          } else {
            this.errorNewVoucher = true;
          }
        },
        (error) => {
          this.errorNewVoucher = true;
        },
        () => {
          /* Reset selected purchasable values */
          this.resetSelectedPurchasableValues();

          /* Reload active and purchasable vouchers list */
          this.showActiveVouchers();
          this.showPurchasableVouchers();

          this.newVoucherOk = true;
        }
      );
  }

  closeModalNewVoucher() {
    /* Close New Voucher Modal */
    $('#cpy-wallet-modal-new-voucher').modal('hide');
    if (this.successNewVoucher) {
      this.router.navigate(['company/cpyDashboard/orders']);
    }
    this.successNewVoucher = false;
    this.errorNewVoucher = false;
  }

  /* Show new voucher type creation modal */
  onClickNewVoucher() {
    $('#cpy-wallet-modal-new-voucher').modal('show');
  }

  /* Control checkboxes statuses and 'trigger' quantity change event when clicking on a checkbox */
  onClickPurchasableVoucherCheckbox(voucher: VoucherDTO) {
    /* Control whether all checkboxes are checked or not */
    this.checkboxPurchasableCheckControl();

    let vchQuantityInput = $(
      '#cpy-wallet-purchasable-voucher-quantity-' +
        this.idifyVoucherValueAndEndDate(voucher.vchValue, voucher.vchEndDate)
    );

    /* Toggle voucher quantity input */
    vchQuantityInput.prop('disabled', function (i, v) {
      return !v;
    });

    /* Change quantity value to zero if it's disabled */
    if (vchQuantityInput.prop('disabled')) {
      vchQuantityInput.val('0');
    } else {
      vchQuantityInput.val(
        this.selectedPurchasableQuantities.get(
          this.idifyVoucherValueAndEndDate(voucher.vchValue, voucher.vchEndDate)
        ) || '1'
      );
    }

    /* Trigger change event of the relative quantity input */
    vchQuantityInput[0].dispatchEvent(new Event('input'));
  }

  /* Ngx-pagination page change event */
  onPageChangePurchasable() {
    /* Need a little timeout when changing page with pagination, otherwise changes will be applied to previous page */
    setTimeout(() => {
      /* Keep selected quantities saved when switching page. */
      this.selectedPurchasableQuantities.forEach((quantity, id) => {
        $('#cpy-wallet-purchasable-voucher-quantity-' + id).each(function () {
          $(this).val(quantity);
        });
      });

      /* Convert selected vouchers Set() into an Array with only vouchers value */
      let selPurchVchArray = Array.from(
        this.selectedPurchasableVouchers
      ).map((vch) =>
        this.idifyVoucherValueAndEndDate(vch.vchValue, vch.vchEndDate)
      );

      /* Control whether the voucher was previously selected, then check the relative checkbox. */
      $('input:checkbox[id*="purchasable"]').each(function () {
        if (selPurchVchArray.includes($(this).val())) {
          $(this).prop('checked', true);

          /* Trigger click event of the relative checkbox */
          $(this)[0].dispatchEvent(new Event('click'));
        }
      });

      /* Control whether all checkboxes are checked or not */
      this.checkboxPurchasableCheckControl();
    }, 1);
  }

  //#endregion
  /* ^^^ EVENTS ^^^ */

  //#endregion
  /* ^^^ METHODS ^^^ */
}
