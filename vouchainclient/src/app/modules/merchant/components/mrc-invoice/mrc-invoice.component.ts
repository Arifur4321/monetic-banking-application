import { Component, OnInit } from '@angular/core';
import { MrcWalletService } from '../../services/rest/mrc-wallet.service';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { TranslateService } from '@ngx-translate/core';
import { DTOList } from 'src/app/model/dto-list';
import { ValidatorService } from 'src/app/services/validator.service';
import { MrcShowProfileService } from '../../services/rest/mrc-show-profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MerchantDTO } from 'src/app/model/merchant-dto';

/* FontAwesome */
import {
  faExclamationCircle,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';
import { VoucherAllocationDTO } from 'src/app/model/voucher-allocation-dto';

/* Locales */
import localeIt from '@angular/common/locales/it';
import { registerLocaleData, formatCurrency } from '@angular/common';
import { MrcVouchersService } from '../../services/rest/mrc-vouchers.service';
import { TransactionRequestDTO } from 'src/app/model/transaction-request-dto';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

declare var $: any;

/* Environment */
import { environment } from 'src/environments/environment';

/* DateRangePicker Locales */
declare var require: any;
import { L10n } from '@syncfusion/ej2-base';
import { loadCldr } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-mrc-invoice',
  templateUrl: './mrc-invoice.component.html',
  styleUrls: ['./mrc-invoice.component.css'],
})
export class MrcInvoiceComponent implements OnInit {
  /* VoucherDTO */
  /* dto vouchers available */
  dtoVouList: DTOList<VoucherDTO>;
  mrcVouchers: VoucherDTO[] = new Array();
  mrcVouchersInPage: VoucherDTO[] = new Array();

  /* Redeem Vouchers */
  dtoVchToRedeemList: DTOList<VoucherAllocationDTO>;
  mrcVouchersSelectedToRedeem: VoucherDTO[] = new Array();
  vouchersToRedeem: VoucherAllocationDTO[] = new Array();

  /* Statuses */
  tableVouchersAvailableError: boolean = false;
  tableInvoiceError: boolean = false;
  tableInvoicesEmpty: boolean = false;
  tableInvoicesLoading: boolean = false;
  tableVouchersAvailableEmpty: boolean = false;
  tableVouchersAvailableLoading: boolean = false;
  checkSelection: boolean = false;

  /* Modal confirm */
  modalConfirmLoading: boolean = false;
  purchaseOk: boolean = true;

  /* Messages */
  msgTableVoucherBody: string;
  msgTableInvoicesBody: string;
  msgTableVoucherAvailableBody: string;

  /* Pagination */
  selectedPageVoucherAvailable: number = 1;
  selectedPagePastInvoice: number = 1;
  selectedPageVoucherSelected: number = 1;

  /* Array Totals */
  vouSelectedImports: number[] = new Array();
  vouImportsInPage: number[] = new Array();

  /* Total selection */
  vouSelectedTotalPreview: number = 0;

  /* Vouchers quantity selected */
  quantitySelected: number;

  /* Object with key = voucher name, value = quantity selected */
  vouQuantitySelected = {};

  /* Confirm bank data */
  userId: string;
  iban: string;
  ibanOk: boolean = true;
  accountHolder: string;
  accountHolderOk: boolean = true;
  merchantDTO: MerchantDTO;
  faExclamationCircle = faExclamationCircle;

  /* range datePicker 1 */
  start1: Date;
  end1: Date;
  dateStart1: string;
  dateEnd1: string;
  maxDate = new Date();

  /* List of Transactions */
  redeemedTrcList: DTOList<TransactionDTO> = new DTOList();
  redeemedTrc: TransactionDTO[] = new Array();
  transactionToDetail: TransactionDTO = new TransactionDTO();

  /* Alert success and error in modal */
  successAlertModal: boolean = false;
  errorAlertModal: boolean = false;

  /* Reload Icon */
  fasSyncAlt = faSyncAlt;

  constructor(
    private walletService: MrcWalletService,
    private vouchersService: MrcVouchersService,
    public validatorService: ValidatorService,
    private profileService: MrcShowProfileService,
    private authenticatorService: AuthenticationService,
    private modalManager: ModalsManagerService,
    private translatorService: TranslateService
  ) {
    this.userId = this.authenticatorService.getLoggedUserId();

    this.profileService.getShowProfile().subscribe((response) => {
      this.merchantDTO = response;
      this.iban = this.merchantDTO.mrcIban;
    });
    /* Add Italian locale, used to format currency and date (default is 'en-US') */
    registerLocaleData(localeIt, 'it-IT');
  }

  ngOnDestroy(): void {
    this.modalManager.errorsModalReset();
    this.modalManager.successModalReset();

    /* Hide Bootstrap Tooltips when switch component/page */
    $(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  ngOnInit(): void {
    this.getRangeLastMonth();
    this.showRedeemedOrderList(this.dateStart1, this.dateEnd1);
    this.showVouchersAvailableList();

    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });

    /* DateRangePicker Locales */
    loadCldr(
      require('cldr-data/supplemental/numberingSystems.json'),
      require('cldr-data/main/it/ca-gregorian.json'),
      require('cldr-data/main/it/numbers.json'),
      require('cldr-data/main/it/timeZoneNames.json'),
      require('cldr-data/supplemental/weekdata.json') // To load the culture based first day of week
    );

    L10n.load({
      it: {
        daterangepicker: {
          placeholder: this.translatorService.instant(
            'DATE_RANGE_PICKER.SELECT_AN_INTERVAL'
          ),
          startLabel: this.translatorService.instant(
            'DATE_RANGE_PICKER.SELECT_START_DATE'
          ),
          endLabel: this.translatorService.instant(
            'DATE_RANGE_PICKER.SELECT_END_DATE'
          ),
          applyText: this.translatorService.instant(
            'DATE_RANGE_PICKER.APPLY_DATE_RANGE'
          ),
          cancelText: this.translatorService.instant(
            'DATE_RANGE_PICKER.CANCEL_DATE_RANGE'
          ),
          selectedDays: this.translatorService.instant(
            'DATE_RANGE_PICKER.SELECTED_DAYS'
          ),
          days: this.translatorService.instant('DATE_RANGE_PICKER.DAYS'),
          customRange: this.translatorService.instant(
            'DATE_RANGE_PICKER.CUSTOM_RANGE'
          ),
        },
      },
    });
  }

  /* Last month range date */
  getRangeLastMonth() {
    var today = new Date();
    this.dateEnd1 =
      today.getFullYear() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getDate();
    this.end1 = new Date(this.dateEnd1);
    this.dateEnd1 = this.dateToString(this.end1);

    today.setDate(today.getDate() - 30);

    this.dateStart1 =
      today.getFullYear() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getDate();
    this.start1 = new Date(this.dateStart1);
    this.dateStart1 = this.dateToString(this.start1);
  }

  /* Converts date to string */
  dateToString(date: Date): string {
    if (date) {
      return (
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      );
    }
  }

  /* Shows detail modal */
  showOrderDetails(order: TransactionDTO) {
    this.transactionToDetail = order;
    $('#mrc-invoice-modal-vouchers-detail').modal('show');
  }

  /* Converts string value in number */
  parseFloatStringValue(value: string) {
    return parseFloat(value).toFixed(2);
  }

  /* Fill the past transactions table */
  showRedeemedOrderList(startDate: string, endDate: string) {
    if (Array.isArray(this.redeemedTrc) && this.redeemedTrc.length) {
      this.redeemedTrc = [];
    }

    /* Show loading spinner */
    this.tableInvoicesLoading = true;
    this.tableInvoicesEmpty = false;
    this.selectedPagePastInvoice = 1;

    let redeemedTransactionRequestDTO: TransactionRequestDTO = new TransactionRequestDTO();

    redeemedTransactionRequestDTO.startDate = startDate;
    redeemedTransactionRequestDTO.endDate = endDate;
    redeemedTransactionRequestDTO.usrId = this.userId;
    redeemedTransactionRequestDTO.profile = 'merchant';

    this.vouchersService
      .getReedemedVoucherOrdersList(redeemedTransactionRequestDTO)
      .subscribe(
        (response) => {
          /* Hide loading spinner */
          this.tableInvoicesLoading = false;

          if (response.status === 'OK') {
            /* Assign response to a DTOList variable */
            this.redeemedTrcList = response;

            /* Assign response to a voucherDTO variable */
            this.redeemedTrc = response.list;

            /* Check whether array is empty or not */
            if (!Array.isArray(this.redeemedTrc) || !this.redeemedTrc.length) {
              /* Show empty list message in table body */
              this.msgTableInvoicesBody = 'Nessun elemento presente';

              this.tableInvoicesEmpty = true;
            } else {
              this.tableInvoicesEmpty = false;
            }
          } else {
            /* Show error message in active vouchers table body in case of no specific error ('Generic Error') */
            this.msgTableInvoicesBody = this.translatorService.instant(
              'ERRORS.GENERIC'
            );

            this.tableInvoicesLoading = false;
            this.tableInvoicesEmpty = true;
            this.tableInvoiceError = true;
          }
        },
        (error) => {
          this.msgTableInvoicesBody = this.translatorService.instant(
            'ERRORS.GENERIC'
          );
          this.tableInvoicesLoading = false;
          this.tableInvoicesEmpty = true;
          this.tableInvoiceError = true;
        }
      );
  }

  /* Fill the vouchers selected table */
  showVouchersAvailableList() {
    if (Array.isArray(this.mrcVouchers) && this.mrcVouchers.length) {
      this.mrcVouchers = [];
    }

    /* Show loading spinner */
    this.tableVouchersAvailableLoading = true;
    this.tableVouchersAvailableEmpty = false;
    this.selectedPageVoucherAvailable = 1;

    /* Get vouchers from rest service */
    this.walletService.getExpendedVoucherMrc().subscribe(
      (response) => {
        /* Hide loading spinner */
        this.tableVouchersAvailableLoading = false;

        if (response.status === 'OK') {
          /* Assign response to a DTOList variable */
          this.dtoVouList = response;

          /* Assign response to a voucherDTO variable */
          this.mrcVouchers = response.list;

          /* Check whether array is empty or not */
          if (!Array.isArray(this.mrcVouchers) || !this.mrcVouchers.length) {
            /* Show empty list message in table body */

            this.msgTableVoucherAvailableBody = this.translatorService.instant(
              'TABLES.VOUCHERS.EMPTY_TABLE'
            );

            this.tableVouchersAvailableEmpty = true;
          } else {
            this.tableVouchersAvailableEmpty = false;
          }
        } else {
          /* Show error message in active vouchers table body in case of no specific error ('Generic Error') */
          this.msgTableVoucherAvailableBody = this.translatorService.instant(
            'ERRORS.GENERIC'
          );

          this.tableVouchersAvailableLoading = false;
          this.tableVouchersAvailableEmpty = true;
          this.tableVouchersAvailableError = true;
        }
      },
      (error) => {
        this.msgTableVoucherAvailableBody = this.translatorService.instant(
          'ERRORS.GENERIC'
        );
        this.tableVouchersAvailableLoading = false;
        this.tableVouchersAvailableEmpty = true;
        this.tableVouchersAvailableError = true;
      }
    );
  }

  /* Saves quantity of vouchers selected in an object */
  getQuantitySelected(event, vchName, vchValue, vchQuantity) {
    /* Checks if the input is grater or smaller than availability */
    if (parseInt(event.target.value) > parseInt(vchQuantity)) {
      this.quantitySelected = vchQuantity * parseFloat(vchValue);

      /* Sets the input to max quantity available */
      $('#mrc-invoice-vouchers tbody>tr').each(function () {
        if ($(this).find('td:eq(1)').children().val() === vchName) {
          /* $(this).find('#mrc-invoice-modal-qselector').val(parseInt(vchQuantity)).change(); */
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
      $('#mrc-invoice-vouchers tbody>tr').each(function () {
        if ($(this).find('td:eq(1)').children().val() === vchName) {
          /* $(this).find('#mrc-invoice-modal-qselector').val(parseInt(vchQuantity)).change(); */
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

    /* Sums the values */
    this.vouSelectedTotalPreview = this.vouImportsInPage.reduce(
      (x, y) => x + y
    );
  }

  /* Returns the import of voucher selected */
  quantitySelectedToMultiply(vchName, vchValue) {
    let res = 0;
    if (this.vouQuantitySelected.hasOwnProperty(vchName)) {
      res = this.vouQuantitySelected[vchName] / vchValue;
    }
    return res;
  }

  /* Adds a single voucher selected to an array of voucherDTO */
  onSingleVoucherSelected(vchNameFromHtml) {
    let arrChecked: VoucherDTO[] = new Array();
    let arrNotChecked: VoucherDTO[] = new Array();
    let obInitValue = {};

    /* List vouchers checked */
    $('#mrc-invoice-vouchers tbody>tr')
      .has('input:checkbox:checked')
      .each(function () {
        let vchDto: VoucherDTO = new VoucherDTO();
        /* !!! The name selected is the real name of the voucher, not the one in the table !!! */
        vchDto.vchName = $(this).find('td:eq(1)').children().val();
        vchDto.vchEndDate = $(this).find('td:eq(3)').text();
        vchDto.vchQuantity = '1';
        vchDto.vchValue = $(this).find('td:eq(2)').children().val();
        arrChecked.push(vchDto);
        obInitValue[vchDto.vchName] = vchDto.vchValue;
        if (vchNameFromHtml === $(this).find('td:eq(1)').children().val()) {
          $(this).find('td:eq(4)').children().val(1);
        }
      })
      .find('#mrc-invoice-modal-qselector')
      .prop('disabled', false)
      .find('#mrc-invoice-export-button')
      .prop('disabled', false);

    /* List vouchers not checked */
    $('#mrc-invoice-vouchers tbody>tr')
      .has('input:checkbox:not(:checked)')
      .each(function () {
        let vchDto: VoucherDTO = new VoucherDTO();
        vchDto.vchName = $(this).find('td:eq(1)').children().val();
        vchDto.vchEndDate = $(this).find('td:eq(3)').text();
        vchDto.vchQuantity = '1';
        vchDto.vchValue = $(this).find('td:eq(2)').children().val();
        arrNotChecked.push(vchDto);
        delete obInitValue[vchDto.vchName];
      })
      .find('#mrc-invoice-modal-qselector')
      .prop('disabled', true)
      .val(0)
      .change();

    /* Push checked vouchers in array */
    arrChecked.forEach((element) => {
      if (
        !this.mrcVouchersInPage.find((el) => el.vchName === element.vchName)
      ) {
        this.mrcVouchersInPage.push(element);
      }
    });

    /* Checks if not checked vouchers are still present in the array */
    this.mrcVouchersInPage.forEach((element, index) => {
      if (arrNotChecked.find((el) => el.vchName === element.vchName)) {
        this.mrcVouchersInPage.splice(index, 1);
      }
    });

    /* Deletes from imports object the element when unchecked and the value from the imports preview */
    arrNotChecked.forEach((element) => {
      if (this.vouQuantitySelected.hasOwnProperty(element.vchName)) {
        this.vouSelectedTotalPreview -= this.vouQuantitySelected[
          element.vchName
        ];
        delete this.vouQuantitySelected[element.vchName];
      }
    });

    /* Adds intial value to vouchers */
    for (const key in obInitValue) {
      if (!(key in this.vouQuantitySelected)) {
        this.vouQuantitySelected[key] = parseFloat(obInitValue[key]);
        this.vouSelectedTotalPreview += parseFloat(obInitValue[key]);
        this.vouImportsInPage.push(this.vouSelectedTotalPreview);
      }
    }
  }

  /* Cleans all operations */
  onKillVouchersSelection() {
    this.mrcVouchersInPage = [];
    $('#mrc-invoice-vouchers input:checkbox').prop('checked', false);
    $('#mrc-invoice-vouchers #mrc-invoice-modal-qselector')
      .prop('disabled', true)
      .val(0)
      .change();
    this.vouSelectedTotalPreview = 0;
    this.vouQuantitySelected = {};
    this.vouImportsInPage = [];
  }

  /* Ngx-pagination pages change event: Voucher Modal */
  onPageChange() {
    setTimeout(() => {
      this.mrcVouchersInPage.forEach((vch) => {
        $('#mrc-invoice-vouchers tbody>tr').each(function () {
          if (vch.vchName === $(this).find('td:eq(1)').children().val()) {
            $(this).find('input:checkbox').prop('checked', true);
          }
        });
      });
      let obSelection = { ...this.vouQuantitySelected };
      $('#mrc-invoice-vouchers tbody>tr').each(function () {
        for (const key in obSelection) {
          if ($(this).find('td:eq(1)').children().val() === key) {
            $(this)
              .find('#mrc-invoice-modal-qselector')
              .val(
                obSelection[key] /
                  parseFloat($(this).find('td:eq(2)').children().val())
              )
              .change();
          }
        }
      });

      $('#mrc-invoice-vouchers tbody>tr')
        .has('input:checkbox:checked')
        .find('#mrc-invoice-modal-qselector')
        .prop('disabled', false);
    }, 1);
  }

  /* Send the invoice */
  onClickExportInvoiceButton() {
    if (this.mrcVouchersInPage.length) {
      /* Enables the cancel button */
      $('#modal-info-footer-button-cancel').prop('disabled', false);

      /* Hides alerts */
      this.successAlertModal = false;
      this.errorAlertModal = false;

      /* Cleans previous operations */
      this.mrcVouchersSelectedToRedeem = [];

      $('#modalBankConfirm').modal('show');

      /* Creates a list of vouchers to redeem */
      this.mrcVouchersInPage.forEach((element) => {
        let vchDto: VoucherDTO = new VoucherDTO();
        vchDto.vchName = element.vchName;
        vchDto.vchEndDate = element.vchEndDate;
        vchDto.vchValue = element.vchValue;
        vchDto.vchQuantity = this.quantitySelectedToMultiply(
          element.vchName,
          element.vchValue
        ).toString();
        this.mrcVouchersSelectedToRedeem.push(vchDto);
      });
      this.checkIBAN();
      this.checkAccountHolder();
    } else {
      this.modalManager.errorsModalGeneric(
        'MODALS.HEADER.WALLET.ERRORS.BUY_VOUCHER_TITLE',
        'MODALS.BODY.WALLET.ERRORS.BUY_VOUCHER_BODY'
      );
    }
  }

  /* Validation Iban */
  checkIBAN() {
    /* Force IBAN without whitespaces */
    this.iban = this.iban.replace(/\s/g, '');
    $('input[name="iban"]').val(this.iban); // Always reflect change on input value

    this.ibanOk = this.validatorService.isValidIBAN(this.iban);
  }

  /* Validation Account Holder */
  checkAccountHolder() {
    this.accountHolderOk = this.validatorService.isNotEmpty(this.accountHolder);
  }

  /* Returns status of iban and account holder */
  checkBankData() {
    if (this.ibanOk && this.accountHolderOk) {
      return true;
    } else {
      return false;
    }
  }

  /* Submit invoice */
  sendInvoice() {
    /* Show loading button */
    this.purchaseOk = false;

    if (this.checkBankData()) {
      /* Adds one voucher allocation dto to a list */
      let listVouchersAllocation: VoucherAllocationDTO[] = new Array();

      /* Voucher allocation dto to insert in the list */
      let vchToRedeem: VoucherAllocationDTO = new VoucherAllocationDTO();
      vchToRedeem.fromId = this.userId;
      vchToRedeem.iban = this.iban;
      vchToRedeem.accountHolder = this.accountHolder;
      vchToRedeem.voucherList = this.mrcVouchersSelectedToRedeem;
      vchToRedeem.profile = 'merchant';
      listVouchersAllocation.push(vchToRedeem);

      /* Disables the cancel button, inputs and x-button */
      $('#modal-info-footer-button-cancel').prop('disabled', true);
      $('input').prop('disabled', true);
      $('#mrc-invoice-modal-button-x').prop('disabled', true);

      this.vouchersService
        .redeemVoucherOrders(listVouchersAllocation)
        .subscribe(
          (response) => {
            if (response.status === 'OK') {
              setTimeout(() => {
                this.purchaseOk = true;
                $('#mrc-invoice-modal-button-x').prop('disabled', false);
                this.successAlertModal = true;
                /* Update Vochers Available List */
                this.showVouchersAvailableList();
              }, environment.redeemTimeout);
            } else {
              this.purchaseOk = true;
              $('#mrc-invoice-modal-button-x').prop('disabled', false);
              this.errorAlertModal = true;
            }
          },
          (error) => {
            this.purchaseOk = true;
            $('#mrc-invoice-modal-button-x').prop('disabled', false);
            this.errorAlertModal = true;
          }
        );
    }
  }

  closeModal() {
    /* Hide modal */
    $('#modalBankConfirm').modal('hide');

    /* Enable inputs and buttons */
    $('#modal-info-footer-button-cancel').prop('disabled', false);
    $('#modal-info-footer-button').prop('disabled', false);
    $('input').prop('disabled', false);

    /* Resets all selections */
    this.onKillVouchersSelection();
    /* Updates Lists */
    this.showRedeemedOrderList(
      this.dateToString(this.start1),
      this.dateToString(this.end1)
    );

    this.selectedPageVoucherAvailable = 1;
    this.selectedPagePastInvoice = 1;
    this.selectedPageVoucherSelected = 1;
  }
}
