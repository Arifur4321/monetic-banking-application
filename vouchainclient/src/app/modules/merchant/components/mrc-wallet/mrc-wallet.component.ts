import { Component, OnInit } from '@angular/core';
import { MrcWalletService } from '../../services/rest/mrc-wallet.service';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { TranslateService } from '@ngx-translate/core';
import { DTOList } from 'src/app/model/dto-list';

declare var $: any;

/* Locales */
import localeIt from '@angular/common/locales/it';
import { registerLocaleData, formatCurrency } from '@angular/common';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-mrc-wallet',
  templateUrl: './mrc-wallet.component.html',
  styleUrls: ['./mrc-wallet.component.css']
})
export class MrcWalletComponent implements OnInit {

  /* VoucherDTO */
  mrcVouchers: VoucherDTO[] = new Array();
  dtoVouList: DTOList<VoucherDTO>;

  /* Statuses */
  tableEmpty: boolean = false;
  tableError: boolean = false;
  tableLoading: boolean = false;

  /* Messages */
  msgTableBody: string;

  /* Pagination */
  selectedPage: number = 1;

  /* Array Totals */
  totalImports: number = 0;

  constructor(
    private walletService: MrcWalletService,
    private translatorService: TranslateService,
    public validatorService: ValidatorService
  ) {
    /* Add Italian locale, used to format currency and date (default is 'en-US') */
    registerLocaleData(localeIt, 'it-IT');
  }

  ngOnInit(): void {
    this.showWalletList();
  }

  /* Fill the wallet table */
  showWalletList() {

    /* Show loading spinner */
    this.tableLoading = true;

    /* Get vouchers from rest service */
    this.walletService.getExpendedVoucherMrc().subscribe(
      (response) => {
        /* Hide loading spinner */
        this.tableLoading = false;

        if (response.status === 'OK') {

          this.dtoVouList = response;
          this.mrcVouchers = response.list;

          if (!Array.isArray(this.mrcVouchers) || !this.mrcVouchers.length) {
            this.msgTableBody = this.translatorService.instant(
              'TABLES.VOUCHERS.EMPTY_TABLE'
            );

            this.tableEmpty = true;
          } else {
            this.tableEmpty = false;
            this.calcImportsInWallet();
          }
        } else {
          /* Show error message in active vouchers table body in case of no specific error ('Generic Error') */
          this.msgTableBody = this.translatorService.instant(
            'ERRORS.GENERIC'
          );

          this.tableLoading = false;
          this.tableEmpty = true;
          this.tableError = true;
        }
      },
      (error) => {
        this.msgTableBody = this.translatorService.instant(
          'ERRORS.GENERIC'
        );
        this.tableLoading = false;
        this.tableEmpty = true;
        this.tableError = true;
      }
    );
  }

  /* Calc total import */
  calcImportsInWallet() {
    this.mrcVouchers.forEach(element => {
      this.totalImports = this.totalImports + (parseInt(element.vchQuantity) * parseFloat(element.vchValue));
    });
  }

}
