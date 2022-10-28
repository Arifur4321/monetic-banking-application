/* --- DEFAULTS IMPORTS --- */
import { Component, OnInit, OnDestroy } from '@angular/core';

/* vvv CUSTOM IMPORTS vvv */
//#region

/* FontAwesome */
import { faDownload, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

/* jQuery */
declare var $: any;

/* Locales */
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';

/* Models */
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { TransactionRequestDTO } from 'src/app/model/transaction-request-dto';

/* Services */
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmpShowProfileService } from 'src/app/modules/employee/services/rest/emp-show-profile.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { TransactionsService } from 'src/app/services/rest/transactions.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/services/validator.service';

/* DateRangePicker Locales */
declare var require: any;
import { L10n } from '@syncfusion/ej2-base';
import { loadCldr } from '@syncfusion/ej2-base';

//#endregion
/* ^^^ CUSTOM IMPORTS ^^^ */

@Component({
  selector: 'app-cpy-transactions',
  templateUrl: './cpy-transactions.component.html',
  styleUrls: ['./cpy-transactions.component.css'],
})
export class CpyTransactionsComponent implements OnInit, OnDestroy {
  /* vvv ATTRIBUTES vvv */
  //#region

  /* Date Range Picker */
  endDate: Date;
  endDateString: string;
  maxDate = new Date();
  startDate: Date;
  startDateString: string;

  /* FontAwesome Icons */
  fasDownload = faDownload;
  fasSyncAlt = faSyncAlt;

  /* Messages */
  msgTableBody: string;

  /* Models */
  /* employeesNames: Map<string, string> = new Map(); */
  transactionRecipient: EmployeeDTO = new EmployeeDTO();
  transactionToDetail: TransactionDTO = new TransactionDTO();
  transactions: TransactionDTO[];

  /* Pagination */
  selectedPage: number = 1;
  totalTransactions: number;

  /* Statuses */
  tableEmpty: boolean = false;
  tableError: boolean = false;
  tableLoading: boolean = false;

  /* Values */
  numeric = Number;
  userId: string;

  //#endregion
  /* ^^^ ATTRIBUTES ^^^ */

  constructor(
    private authenticatorService: AuthenticationService,
    private empProfileService: EmpShowProfileService,
    private modalManager: ModalsManagerService,
    private transactionsService: TransactionsService,
    private translatorService: TranslateService,
    public validatorService: ValidatorService
  ) {
    /* Add Italian locale, used to format currency and date (default is 'en-US') */
    registerLocaleData(localeIt, 'it-IT');
  }

  ngOnInit(): void {
    this.getRangeLastMonth();
    this.showTransactionsList(1);

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

  /* vvv METHODS vvv */
  //#region

  /* Create a Transaction Request DTO to get list of transaction in specific time period */
  createTransactioRequestDTO(): TransactionRequestDTO {
    const trcRequestDTO: TransactionRequestDTO = new TransactionRequestDTO();

    trcRequestDTO.startDate = this.dateToString(this.startDate);
    trcRequestDTO.endDate = this.dateToString(this.endDate);
    trcRequestDTO.usrId = this.authenticatorService.getLoggedUserId();
    trcRequestDTO.profile = 'company';

    return trcRequestDTO;
  }

  /* Transform a Date object into a string formatted as 'yyyy-MM-dd' */
  dateToString(date: Date): string {
    if (date) {
      return (
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      );
    }
  }

  /* Export currently shown transactions into a XLSX file */
  exportTransactions() {
    this.transactionsService
      .exportTransaction(this.createTransactioRequestDTO())
      .subscribe(
        (response) => {
          if (response.status === 'OK') {
            this.startDateString = this.dateToString(this.startDate);
            this.endDateString = this.dateToString(this.endDate);

            /* Convert transactionsListExcel string into a Blob and download it */
            this.transactionsService.convertB64StringToBlobAndDownload(
              response.transactionListExcel,
              this.startDateString,
              this.endDateString
            );
          } else {
            /* Show error messages ('Generic Error') */
            this.modalManager.errorsModalGeneric(
              'Errore Esportazione Storico',
              'ERRORS.GENERIC'
            );
          }
        },
        (error) => {
          /* Show error messages ('Generic HTTP Error') */
          this.modalManager.errorsModalGeneric(
            'Errore Esportazione Storico',
            'ERRORS.GENERIC'
          );
        }
      );
  }

  /* Last month range date */
  getRangeLastMonth() {
    let todayDate = new Date();

    this.endDateString =
      todayDate.getFullYear() +
      '/' +
      (todayDate.getMonth() + 1) +
      '/' +
      todayDate.getDate();
    this.endDate = new Date(this.endDateString);

    todayDate.setDate(todayDate.getDate() - 30);

    this.startDateString =
      todayDate.getFullYear() +
      '/' +
      (todayDate.getMonth() + 1) +
      '/' +
      todayDate.getDate();
    this.startDate = new Date(this.startDateString);
  }

  /* Get info about employee */
  /* getTransactionEmployee(trcId: string, usrId: string) {
    this.empProfileService.getProfileDetails(usrId).subscribe((response) => {
      this.employeesNames.set(
        trcId,
        response.empFirstName + ' ' + response.empLastName
      );
    });
  } */

  /* Get info about the transaction's recipient */
  getTransactionRecipient(usrId: string) {
    this.empProfileService.getProfileDetails(usrId).subscribe((response) => {
      this.transactionRecipient = response;
    });
  }

  /* Full description for various types of transactions */
  getTrcTypeFullDescription(trcType: string) {
    switch (trcType) {
      case 'ACV': {
        return 'Acquisto di buoni';
      }
      case 'ALL': {
        return 'Trasferimento di buoni verso ';
      }
      default: {
        return 'Tipologia di transazione generica';
      }
    }
  }

  /* Show more details about a specific transaction */
  showTransactionDetails(trc: TransactionDTO) {
    /* Get info about the transaction's recipient (if necessary) */
    if (trc.trcType === 'ALL') {
      this.getTransactionRecipient(trc.usrIdA);
    }

    /* Assign selected transaction to detail */
    this.transactionToDetail = trc;

    /* Show transaction details modal */
    $('#cpy-transactions-modal-transaction-detail').modal('show');
  }

  /* Fill the transactions table */
  showTransactionsList(page: number) {
    const perPage = 5;
    const startPage = (page - 1) * perPage;
    const endPage = startPage + perPage;

    /* Empty transactions list */
    if (Array.isArray(this.transactions) && this.transactions.length) {
      this.transactions = [];
    }

    /* Show loading spinner */
    this.tableLoading = true;

    /* Reset table satus */
    this.tableEmpty = false;

    /* Reset selected pagination page */
    this.selectedPage = page;

    /* Get transactions list from rest service */
    this.transactionsService
      .showTransactionsList(this.createTransactioRequestDTO())
      .subscribe(
        (response) => {
          /* Hide loading spinner */
          this.tableLoading = false;

          if (response.status === 'OK') {
            /* Assign response list to an array of EmployeesDTO */
            this.transactions = response.list;

            /* Check whether array is empty or not */
            if (
              !Array.isArray(this.transactions) ||
              !this.transactions.length
            ) {
              /* Show empty list message in table body */
              this.msgTableBody = this.translatorService.instant(
                'Nessuna transazione trovata'
              );

              this.tableEmpty = true;
            } else {
              this.tableEmpty = false;

              this.totalTransactions = this.transactions.length;

              this.transactions = this.transactions.slice(startPage, endPage);

              /* this.transactions
                .filter((trc) => trc.trcType === 'ALL')
                .forEach((trc) => {
                  this.getTransactionEmployee(trc.trcId, trc.usrIdA);
                }); */
            }
          } else {
            /* Show error message in table body in case of no specific error ('Generic Error') */
            this.msgTableBody = this.translatorService.instant(
              'ERRORS.GENERIC'
            );

            this.tableLoading = false;
            this.tableEmpty = true;
            this.tableError = true;
          }
        },
        (error) => {
          /* Show error message in table body in case of no specific HTTP error ('Generic Error') */
          this.msgTableBody = this.translatorService.instant('ERRORS.GENERIC');

          this.tableLoading = false;
          this.tableEmpty = true;
          this.tableError = true;
        }
      );
  }

  //#endregion
  /* ^^^ METHODS ^^^ */
}
