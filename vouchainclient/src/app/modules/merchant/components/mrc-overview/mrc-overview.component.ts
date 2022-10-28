import { Component, OnInit } from '@angular/core';

declare var $: any;
import localeIt from '@angular/common/locales/it';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmpShowProfileService } from 'src/app/modules/employee/services/rest/emp-show-profile.service';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { MrcShowProfileService } from '../../services/rest/mrc-show-profile.service';
import { MrcWalletService } from '../../services/rest/mrc-wallet.service';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { TransactionRequestDTO } from 'src/app/model/transaction-request-dto';
import { TransactionsService } from 'src/app/services/rest/transactions.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/services/validator.service';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-mrc-overview',
  templateUrl: './mrc-overview.component.html',
  styleUrls: ['./mrc-overview.component.css'],
})
export class MrcOverviewComponent implements OnInit {
  /* vvv ATTRIBUTES vvv */

  /* Messages */
  activeTableBodyMessage: string;
  transactionsTableBodyMessage: string;

  /* Models */
  activeVouchers: VoucherDTO[] = new Array();
  activeVouchersForImports: VoucherDTO[] = new Array();
  mrcDto: MerchantDTO = new MerchantDTO();
  transactions: TransactionDTO[];

  /* Statuses */
  activeTableEmpty: boolean = false;
  activeTableError: boolean = false;
  activeTableLoading: boolean = false;
  transactionsTableEmpty: boolean = false;
  transactionsTableError: boolean = false;
  transactionsTableLoading: boolean = false;

  /* Array Totals */
  endDateString: string;
  startDateString: string;
  totalImports: number = 0;

  constructor(
    private authenticatorService: AuthenticationService,
    private empProfileService: EmpShowProfileService,
    private showProfileServiceMrc: MrcShowProfileService,
    private transactionsService: TransactionsService,
    private translatorService: TranslateService,
    private walletService: MrcWalletService,
    public validatorService: ValidatorService
  ) {
    registerLocaleData(localeIt, 'it-IT');
  }

  ngOnInit(): void {
    this.showProfileServiceMrc.getShowProfile().subscribe((response) => {
      this.mrcDto = response;
    });

    this.getRangeLastMonth();
    this.showActiveVouchers();
    this.showTransactionsList();
  }

  /* vvv METHODS vvv */

  /* Fill the active vouchers table */
  showActiveVouchers() {
    /* Show loading spinner */
    this.activeTableLoading = true;

    /* Get purchasable vouchers list from rest service */
    this.walletService.getExpendedVoucherMrc().subscribe(
      (response) => {
        /* Hide loading spinner */
        this.activeTableLoading = false;

        if (response.status === 'OK') {
          /* Assign response list to an array of VouchersDTO */
          if (response.list !== null) {
            this.activeVouchers = response.list.slice(0, 4);
            this.activeVouchersForImports = response.list;
          }

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
            this.calcImportsInWallet();
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

  /* Calc total import in wallet */
  calcImportsInWallet() {
    this.activeVouchersForImports.forEach((element) => {
      this.totalImports =
        this.totalImports +
        parseInt(element.vchQuantity) * parseFloat(element.vchValue);
    });
  }

  /* Create a Transaction Request DTO to get list of transaction in specific time period */
  createTransactioRequestDTO(): TransactionRequestDTO {
    const trcRequestDTO: TransactionRequestDTO = new TransactionRequestDTO();

    trcRequestDTO.startDate = this.startDateString;
    trcRequestDTO.endDate = this.endDateString;
    trcRequestDTO.usrId = this.authenticatorService.getLoggedUserId();
    trcRequestDTO.profile = 'merchant';

    return trcRequestDTO;
  }

  /* Sets last month as default range */
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

  /* Checks type of transaction */
  getTrcTypeFullDescription(trcType: string) {
    switch (trcType) {
      case 'SPS': {
        return 'Ricezione di buoni da parte di ';
      }
      case 'RED': {
        return 'Riscatto buoni';
      }
      default: {
        return 'Tipologia di transazione generica';
      }
    }
  }

  /* Shows transactions list */
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
