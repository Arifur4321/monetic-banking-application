import { Component, OnInit } from '@angular/core'

/* Locales */
declare var $: any;
import localeIt from '@angular/common/locales/it';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DTOList } from 'src/app/model/dto-list';
import { EmpShowProfileService } from '../../services/rest/emp-show-profile.service';
import { EmpVouchersService } from '../../services/rest/emp-vouchers.service';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { TransactionRequestDTO } from 'src/app/model/transaction-request-dto';
import { TransactionsService } from 'src/app/services/rest/transactions.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/services/validator.service';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { registerLocaleData } from '@angular/common';
import { MrcShowProfileService } from 'src/app/modules/merchant/services/rest/mrc-show-profile.service';


@Component({
  selector: 'app-emp-profile',
  templateUrl: './emp-profile.component.html',
  styleUrls: ['./emp-profile.component.css']
})
export class EmpProfileComponent implements OnInit {
  empDto: EmployeeDTO = new EmployeeDTO();

  /* VoucherDTO */
  empVouchers: VoucherDTO[];
  dtoList: DTOList<VoucherDTO>;
  vouchers: VoucherDTO[] = new Array();

  /* Statuses */
  tableEmpty: boolean = false;
  tableError: boolean = false;
  tableLoading: boolean = false;
  transactionsTableEmpty: boolean = false;
  transactionsTableError: boolean = false;
  transactionsTableLoading: boolean = false;

  /* Messages */
  msgError: string;
  msgTableBody: string;
  transactionsTableBodyMessage: string;

  /* Pagination */
  selectedPage: number = 1;

  totalImport: number;

  /* --- */
  transactions: TransactionDTO[];
  endDateString: string;
  startDateString: string;
  merchantsNames: Map<string, string> = new Map();

  constructor(
    private authenticatorService: AuthenticationService,
    private empVouchersService: EmpVouchersService,
    private mrcProfileService: MrcShowProfileService,
    private showProfileService: EmpShowProfileService,
    private transactionsService: TransactionsService,
    private translatorService: TranslateService,
    public validatorService: ValidatorService
  ) {
    /* Add Italian locale, used to format currency and date (default is 'en-US') */
    registerLocaleData(localeIt, 'it-IT');
  }

  ngOnInit(): void {
    this.showVouchersList();

    this.showProfileService.getShowProfile().subscribe((response) => {
      this.empDto = response;
    });

    this.getRangeLastMonth();
    this.showTransactionsList();
  }

  /* Calculate the active total import */
  calculateTotalImport() {
    this.totalImport = 0;

    this.empVouchers.forEach((vch) => {
      this.totalImport += Number(vch.vchValue) * Number(vch.vchQuantity);
    });
  }

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
              'OVERVIEW.WALLET.TABLE_EMPTY'
            );

            this.tableEmpty = true;
          } else {
            this.tableEmpty = false;
            this.calculateTotalImport();

            this.empVouchers.splice(4);
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
        /* TODO: Gestire errori con il metodo subscribe */
        /* Show error message in table body in case of no specific HTTP error ('Generic Error') */
        this.msgTableBody = this.translatorService.instant('ERRORS.GENERIC');

        this.tableLoading = false;
        this.tableEmpty = true;
        this.tableError = true;
      }
    );
  }

  /* Create a Transaction Request DTO to get list of transaction in specific time period */
  createTransactioRequestDTO(): TransactionRequestDTO {
    const trcRequestDTO: TransactionRequestDTO = new TransactionRequestDTO();

    trcRequestDTO.startDate = this.startDateString;
    trcRequestDTO.endDate = this.endDateString;
    trcRequestDTO.usrId = this.authenticatorService.getLoggedUserId();
    trcRequestDTO.profile = 'employee';

    return trcRequestDTO;
  }

  /*  Set data-picker with last month */
  getRangeLastMonth() {
    let todayDate = new Date();

    this.endDateString =
      todayDate.getFullYear() +
      '-' +
      (todayDate.getMonth() + 1) +
      '-' +
      todayDate.getDate();

    todayDate.setDate(todayDate.getDate() - 30);

    this.startDateString =
      todayDate.getFullYear() +
      '-' +
      (todayDate.getMonth() + 1) +
      '-' +
      todayDate.getDate();
  }

  /* Show full description of transactions */
  getTrcTypeFullDescription(trcType: string) {
    switch (trcType) {
      case 'ALL': {
        return 'Accredito di buoni';
      }
      case 'SPS': {
        return 'Trasferimento di buoni verso ';
      }
      default: {
        return 'Tipologia di transazione generica';
      }
    }
  }

  showTransactionsList() {
    /* Empty transactions list */
    if (Array.isArray(this.transactions) && this.transactions.length) {
      this.transactions = [];
    }

    /* Show loading spinner */
    this.transactionsTableLoading = true;

    /* Reset table satus */
    this.transactionsTableEmpty = false;

    /* Get transactions list from rest service */
    this.transactionsService
      .showTransactionsList(this.createTransactioRequestDTO())
      .subscribe(
        (response) => {
          /* Hide loading spinner */
          this.transactionsTableLoading = false;

          if (response.status === 'OK') {
            /* Assign response list to an array of EmployeesDTO */
            this.transactions = [...response.list];

            /* Check whether array is empty or not */
            if (
              !Array.isArray(this.transactions) ||
              !this.transactions.length
            ) {
              /* Show empty list message in table body */
              this.transactionsTableBodyMessage = this.translatorService.instant(
                'Nessuna transazione trovata'
              );

              this.transactionsTableEmpty = true;
            } else {
              this.transactionsTableEmpty = false;

              this.transactions.splice(4);
            }
          } else {
            /* Show error message in table body in case of no specific error ('Generic Error') */
            this.transactionsTableBodyMessage = this.translatorService.instant(
              'ERRORS.GENERIC'
            );

            this.transactionsTableLoading = false;
            this.transactionsTableEmpty = true;
            this.transactionsTableError = true;
          }
        },
        (error) => {
          /* Show error message in table body in case of no specific HTTP error ('Generic Error') */
          this.transactionsTableBodyMessage = this.translatorService.instant(
            'ERRORS.GENERIC'
          );

          this.transactionsTableLoading = false;
          this.transactionsTableEmpty = true;
          this.transactionsTableError = true;
        }
      );
  }

}
