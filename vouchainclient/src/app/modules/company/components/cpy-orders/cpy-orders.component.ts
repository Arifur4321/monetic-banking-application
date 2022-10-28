import { Component, OnInit, OnDestroy } from '@angular/core';

import localeIt from '@angular/common/locales/it';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CpyOrdersService } from './../../services/rest/cpy-orders.service';
import { DTOList } from 'src/app/model/dto-list';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { Router } from '@angular/router';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { TransactionRequestDTO } from 'src/app/model/transaction-request-dto';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/services/validator.service';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { registerLocaleData } from '@angular/common';
import { TransactionsService } from 'src/app/services/rest/transactions.service';
import { InvoiceDTO } from 'src/app/model/invoice-dto';

/* jQuery */
declare var $: any;

/* DateRangePicker Locales */
declare var require: any;
import { L10n } from '@syncfusion/ej2-base';
import { loadCldr } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-cpy-orders',
  templateUrl: './cpy-orders.component.html',
  styleUrls: ['./cpy-orders.component.css'],
})
export class CpyOrdersComponent implements OnInit, OnDestroy {
  /* range datePicker*/

  start1: Date;
  end1: Date;
  stringDateStart1: string;
  stringDateEnd1: string;

  start2: Date;
  end2: Date;
  stringDateStart2: string;
  stringDateEnd2: string;
  maxDate = new Date();

  /* Pagination */
  selectedPage1: number = 1;
  selectedPage2: number = 1;

  /* Messages */
  msgError: string;
  msgTableBody1: string;
  msgTableBody2: string;

  /* Statuses */
  tableLoading1: boolean = false;
  tableEmpty1: boolean = false;
  tableError1: boolean = false;

  tableLoading2: boolean = false;
  tableEmpty2: boolean = false;
  tableError2: boolean = false;

  isDeleted: boolean = false;

  /* Variable */

  profile: string = 'company';

  /* model */
  transactionToDelete: TransactionDTO;
  transactionToInvoice: TransactionDTO;
  transactionToDetail: TransactionDTO = new TransactionDTO();

  payedOrders: TransactionDTO[] = new Array();
  notPayedOrders: TransactionDTO[] = new Array();

  fasSyncAlt = faSyncAlt;

  invoiceDTO: InvoiceDTO;

  constructor(
    private authenticatorService: AuthenticationService,
    private cpyOrdersService: CpyOrdersService,
    private modalManager: ModalsManagerService,
    private router: Router,
    private translatorService: TranslateService,
    public validatorService: ValidatorService,
    private transactionService: TransactionsService
  ) {
    /* Add Italian locale, used to format currency and date (default is 'en-US') */
    registerLocaleData(localeIt, 'it-IT');
  }

  ngOnInit(): void {
    $('body').css('overflow-x', 'hidden');
    this.setDateRangeToLastMonth();
    this.showPayedOrders(this.stringDateStart1, this.stringDateEnd1, 'payed');
    this.showNotPayedOrders(
      this.stringDateStart2,
      this.stringDateEnd2,
      'not_payed'
    );

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

  ngOnDestroy(): void {
    /* Hide Bootstrap Tooltips when switch component/page */
    $(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  /* Set default value of dateRangePickers */
  setDateRangeToLastMonth() {
    var today = new Date();

    /* set second dateRangePicker to last month */
    this.stringDateEnd1 =
      today.getFullYear() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getDate();
    this.end1 = new Date(this.stringDateEnd1);

    today.setDate(today.getDate() - 30);

    /* set first dateRangePicker to last month */
    this.stringDateStart1 =
      today.getFullYear() +
      '/' +
      (today.getMonth() + 1) +
      '/' +
      today.getDate();
    this.start1 = new Date(this.stringDateStart1);

    this.stringDateStart2 = this.stringDateStart1;
    this.stringDateEnd2 = this.stringDateEnd1;

    this.start2 = new Date(this.stringDateStart2);
    this.end2 = new Date(this.stringDateEnd2);

    this.stringDateEnd1 = this.dateToString(this.end1);
    this.stringDateStart1 = this.dateToString(this.start1);
    this.stringDateEnd2 = this.dateToString(this.end2);
    this.stringDateStart2 = this.dateToString(this.start2);
  }

  dateToString(date: Date): string {
    if (date) {
      return (
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      );
    }
  }

  showPayedOrders(startDate: string, endDate: string, trcPayed: string) {
    if (Array.isArray(this.payedOrders) && this.payedOrders.length) {
      this.payedOrders = [];
    }

    this.tableLoading1 = true;
    this.tableEmpty1 = false;
    this.selectedPage1 = 1;

    let trcRequest: TransactionRequestDTO = new TransactionRequestDTO();
    let ordersDtoList: DTOList<TransactionDTO> = new DTOList();

    /* Set TransactionRequestDTO */
    trcRequest.startDate = startDate;
    trcRequest.endDate = endDate;
    trcRequest.usrId = this.authenticatorService.getLoggedUserId();
    /* trcRequest.trcPayed = trcPayed; */
    trcRequest.profile = this.profile;

    this.cpyOrdersService.getCpyOrdersList(trcRequest).subscribe(
      (response) => {
        /* Hide loading spinner table 1 */
        this.tableLoading1 = false;

        if (response.status === 'OK') {
          /* Assign response to a DTOList variable */
          ordersDtoList = response;
          this.payedOrders = ordersDtoList.list;

          /* Check whether array is empty or not */
          if (!Array.isArray(this.payedOrders) || !this.payedOrders.length) {
            /* Show empty list message in table body */
            this.msgTableBody1 = this.translatorService.instant(
              'TABLES.ORDERS.EMPTY_TABLE'
            );

            this.tableEmpty1 = true;
          } else {
            this.tableEmpty1 = false;
            this.payedOrders = this.payedOrders.filter(
              (order) => order.trcCancDate || order.trcPayed === trcPayed
            );
          }
        } else {
          this.msgTableBody1 = this.translatorService.instant('ERRORS.GENERIC');
          this.tableLoading1 = false;
          this.tableEmpty1 = true;
          this.tableError1 = true;
        }
      },
      (error) => {
        /* TODO: Gestire errori con il metodo subscribe */
        /* Show error message in table body in case of no specific HTTP error ('Generic Error') */

        this.msgTableBody1 = this.translatorService.instant('ERRORS.GENERIC');
        this.tableLoading1 = false;
        this.tableEmpty1 = true;
        this.tableError1 = true;
      }
    );
  }

  showNotPayedOrders(startDate: string, endDate: string, trcPayed: string) {
    if (Array.isArray(this.notPayedOrders) && this.notPayedOrders.length) {
      this.notPayedOrders = [];
    }

    this.tableLoading2 = true;
    this.tableEmpty2 = false;
    this.selectedPage2 = 1;

    let trcRequest: TransactionRequestDTO = new TransactionRequestDTO();
    let ordersDtoList: DTOList<TransactionDTO> = new DTOList();

    /* Set TransactionRequestDTO */
    trcRequest.startDate = startDate;

    trcRequest.endDate = endDate;

    trcRequest.usrId = this.authenticatorService.getLoggedUserId();

    trcRequest.trcPayed = trcPayed;

    trcRequest.profile = this.profile;

    this.cpyOrdersService.getCpyOrdersList(trcRequest).subscribe(
      (response) => {
        /* Hide loading spinner table 1 */
        this.tableLoading2 = false;

        if (response.status === 'OK') {
          /* Assign response to a DTOList variable */
          ordersDtoList = response;
          this.notPayedOrders = ordersDtoList.list.filter(
            (order) => order.trcCancDate === null
          );

          if (
            !Array.isArray(this.notPayedOrders) ||
            !this.notPayedOrders.length
          ) {
            /* Show empty list message in table body */
            this.msgTableBody2 = this.translatorService.instant(
              'TABLES.ORDERS.EMPTY_TABLE'
            );

            this.tableEmpty2 = true;
          } else {
            this.tableEmpty2 = false;
          }
        } else {
          this.msgTableBody2 = this.translatorService.instant('ERRORS.GENERIC');
          this.tableLoading2 = false;
          this.tableEmpty2 = true;
          this.tableError2 = true;
        }
      },
      (error) => {
        /* TODO: Gestire errori con il metodo subscribe */
        /* Show error message in table body in case of no specific HTTP error ('Generic Error') */
        this.msgTableBody2 = this.translatorService.instant('ERRORS.GENERIC');
        this.tableLoading2 = false;
        this.tableEmpty2 = true;
        this.tableError2 = true;
      }
    );
  }

  showOrderDetails(order: TransactionDTO) {
    this.transactionToDetail = order;
    if (this.transactionToDetail.trcCancDate != null) {
      this.isDeleted = true;
    } else {
      this.isDeleted = false;
    }
    $('#cpy-orders-modal-vouchers-detail').modal('show');
  }

  showOrderToDeleteDetails(order: TransactionDTO) {
    this.transactionToDetail = order;
    $('#cpy-orders-modal-confirm-delete').modal('show');
  }

  parseFloatStringValue(value: string) {
    return parseFloat(value).toFixed(2);
  }

  deleteOrderById(trcId: string) {
    this.cpyOrdersService.deleteOrderById(trcId).subscribe(
      (response) => {
        if (response.status === 'OK') {
          this.showNotPayedOrders(
            this.dateToString(this.start2),
            this.dateToString(this.end2),
            'not_payed'
          );

          $('#cpy-orders-modal-confirm-delete').modal('hide');

          this.modalManager.successModalGeneric(
            'Ordine Annullato',
            "Annullamento dell'ordine avvenuto con successo"
          );
        } else {
          $('#cpy-orders-modal-confirm-delete').modal('hide');

          this.modalManager.errorsModalGeneric(
            'Errore Annullamento Ordine',
            'ERRORS.GENERIC'
          );
        }
      },
      (error) => {
        $('#cpy-orders-modal-confirm-delete').modal('hide');

        this.modalManager.errorsModalGeneric(
          'Errore Annullamento Ordine',
          'ERRORS.GENERIC'
        );
      }
    );
  }

  onClickDownloadInvoice(type: string, trcId: string, trcDate: string) {
    this.transactionService.getInvoice(trcId, type).subscribe(
      (response) => {
        this.invoiceDTO = response;
        if (response.status === 'OK') {
          this.transactionService.convertAndDownloadInvoice(
            this.invoiceDTO.invoice,
            type,
            trcDate
          );
        } else {
          this.modalManager.errorsModalGeneric(
            'Errore Esportazione Ordine',
            'ERRORS.GENERIC'
          );
        }
      },
      (error) => {
        this.modalManager.errorsModalGeneric(
          'Errore Esportazione Ordine',
          'ERRORS.GENERIC'
        );
      }
    );
  }
}
