import { Component, OnInit } from '@angular/core';
import { EmpVouchersService } from '../../services/rest/emp-vouchers.service';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { TranslateService } from '@ngx-translate/core';
import { DTOList } from 'src/app/model/dto-list';
/* Locales */
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { ValidatorService } from 'src/app/services/validator.service';

declare var $: any;

@Component({
  selector: 'app-emp-wallet',
  templateUrl: './emp-wallet.component.html',
  styleUrls: ['./emp-wallet.component.css'],
})
export class EmpWalletComponent implements OnInit {


  /* VoucherDTO */
  empVouchers: VoucherDTO[] = new Array();
  dtoList: DTOList<VoucherDTO>;
  vouchers: VoucherDTO[] = new Array();

  /* Statuses */
  tableEmpty: boolean = false;
  tableError: boolean = false;
  tableLoading: boolean = false;

  /* Messages */
  msgError: string;
  msgTableBody: string;

  /* Pagination */
  selectedPage: number = 1;


  /* Values */
  selectedQuantity: Map<string, number> = new Map();
  totalImport: number;

  constructor(
    private empVouchersService: EmpVouchersService,
    private translatorService: TranslateService,
    public validatorService: ValidatorService
  ) {
 
    /* Add Italian locale, used to format currency and date (default is 'en-US') */
    registerLocaleData(localeIt, 'it-IT');
  }


  ngOnInit(): void {
    this.showVouchersList();
  }

  /* vvv METHODS vvv */

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

          /* Assign response list to an array of MerchantsDTO */
          this.empVouchers = response.list;

          /* Check whether array is empty or not */
          if (!Array.isArray(this.empVouchers) || !this.empVouchers.length) {
            /* Show empty list message in table body */
            this.msgTableBody = this.translatorService.instant(
              'TABLES.VOUCHERS.EMPTY_TABLE'
            );

            this.tableEmpty = true;
          } else {
            this.tableEmpty = false;

            this.calculateTotalImport();
          }
        } else {
          this.msgTableBody = this.translatorService.instant('ERRORS.GENERIC');
          this.tableEmpty = true;
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

/* Round value with 2 decimals*/
  parseFloatStringValue(value: string) {
    return parseFloat(value).toFixed(2);
  }

  /* Round value */
  parseIntStringValue(value: string) {
    return parseInt(value);
  }


  /* Ngx-pagination pages change event: Voucher Modal */
  onPageChange() {
    setTimeout(() => {
      this.empVouchers.forEach((vch) => {
        $('input:checkbox').each(function () {
          if (vch.vchValue === $(this).val()) {
            $(this).prop('checked', true);
          }
        });
      });
      $('#emp-invoice-modal-vouchers tbody>tr').has('input:checkbox:checked').find('#emp-invoice-modal-qselector').prop('disabled', false);
    }, 1);
  }

}

