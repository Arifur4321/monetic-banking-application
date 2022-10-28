import { Component, OnInit } from '@angular/core';

/* vvv CUSTOM IMPORTS vvv */

/* Custom Messages */
import * as myMessages from 'src/globals/messages';

/* jQuery */
declare var $: any;

/* Models */
import { DTOList } from 'src/app/model/dto-list';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { VoucherDTO } from 'src/app/model/voucher-dto';

/* Services */
import { EmpShowMerchantsService } from '../../services/rest/emp-show-merchants.service';
import { EmpVouchersService } from '../../services/rest/emp-vouchers.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { VoucherAllocationDTO } from 'src/app/model/voucher-allocation-dto';
import { AuthenticationService } from 'src/app/services/authentication.service';

/* Locales */
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';

@Component({
  selector: 'app-emp-merchants',
  templateUrl: './emp-merchants.component.html',
  styleUrls: ['./emp-merchants.component.css'],
})
export class EmpMerchantsComponent implements OnInit {
  /* Merchant User Id */
  usrId: string;

/* Merchant First Name */
  mrcFirstNameReq: string;

/* Merchant Last Name */
  mrcLastNameReq: string;

  /* Merchant Ragione Sociale */
  mrcRagioneSociale: string;

  /* Merchant Address */
  mrcAddress: string;

  /* Merchant City */
  mrcCity: string;

  /* Merchant Province */
  mrcProv: string;

  /* Merchant Ragione Sociale */
  mrcZip: string;

  /* ^^^ FORM VALUES ^^^ */

  /* Messages */
  msgError: string;
  msgTableBody: string;

  /* Models */
  dtoMrcList: DTOList<MerchantDTO>;
  merchants: MerchantDTO[];
  selectedMerchants: Set<MerchantDTO> = new Set();

  /* Pagination */
  selectedPage: number = 1;

  /* Statuses */
  tableEmpty: boolean = false;
  tableError: boolean = false;
  tableLoading: boolean = false;

  /* VoucherDTO */
  empVouchers: VoucherDTO[] = new Array();
  dtoList: DTOList<VoucherDTO>;

  /* Vouchers quantity selected */
  quantitySelected: number;

  /* ^^^ ATTRIBUTES ^^^ */

  constructor(
    private authenticatorService: AuthenticationService,
    private empShowMrcService: EmpShowMerchantsService,
    private empVouchersService: EmpVouchersService,
    private route: Router,
    private translatorService: TranslateService,
    private modalManager: ModalsManagerService
  ) {

    /* Add Italian locale, used to format currency and date (default is 'en-US') */
    registerLocaleData(localeIt, 'it-IT');
  }


  ngOnInit(): void {
    this.showMerchantsList();


    /* Enable Bootstrap Tooltips */
    /* FIXME: Non sembra funzionare con ngx-translate.
       La causa sembra dovuta ad un ritardo nel riempire con le "traduzioni"
       Possibile soluzione: https://github.com/ngx-translate/core/issues/517#issuecomment-299637956
    */
    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });
  }

  /* vvv METHODS vvv */

  /* Add or delete selected MerchantDTO */ 
  onChangeMerchantCheckbox(event, merchant) {
    /* Check whether the checkbox is checked or not */
    if (event.target.checked) {
      /* If checked add relative merchant to array */
      this.selectedMerchants.add(merchant);
    } else {
      /* Else remove relative merchant to array (if present) */
      this.selectedMerchants.delete(merchant);
    }

  }

 /* Enable send button */ 
  onClickRadioButton() {
    if (this.selectedMerchants.size) {
      $('#btn-send-voucher').prop('disabled',false);
    } else {
      $('#btn-send-voucher').prop('disabled', true);
    }
  }



  /* Fill the employees table */
  showMerchantsList() {
    /* Show loading spinner */
    this.tableLoading = true;

    /* Get employees list from rest service */
    this.empShowMrcService.showMerchantsList().subscribe(
      (response) => {
        /* Hide loading spinner */
        this.tableLoading = false;

        /* Assign response to a DTOList variable */
        this.dtoMrcList = response;

        /* Assign response list to an array of EmployeesDTO */
        this.merchants = response.list;

        /* Check whether array is empty or not */
        if (!Array.isArray(this.merchants) || !this.merchants.length) {
          /* Show empty list message in table body */
          this.msgTableBody = this.translatorService.instant(
            'MERCHANTS.TABLE_EMPTY'
          );

          this.tableEmpty = true;
        } else {
          this.tableEmpty = false;
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


}
