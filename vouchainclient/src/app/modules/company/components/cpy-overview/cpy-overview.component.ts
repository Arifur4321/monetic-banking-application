/* --- DEFAULTS IMPORTS --- */
import { Component, OnInit, OnDestroy } from '@angular/core';
/* Environment */
import { environment } from 'src/environments/environment';
/* jQuery */
declare var $: any;
declare var request:any ;
declare var V ;
/* Locales */
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
/* Models */
import { CompanyDTO } from 'src/app/model/company-dto';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { VoucherDTO } from 'src/app/model/voucher-dto';

/* Services */
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CpyShowProfileService } from '../../services/rest/cpy-show-profile.service';
import { CpyVouchersService } from '../../services/rest/cpy-vouchers.service';
import { EmpShowProfileService } from 'src/app/modules/employee/services/rest/emp-show-profile.service';
import { TransactionRequestDTO } from 'src/app/model/transaction-request-dto';
import { TransactionsService } from 'src/app/services/rest/transactions.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/services/validator.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { DTOList } from 'src/app/model/dto-list';
import { EmpVouchersService } from 'src/app/modules/employee/services/rest/emp-vouchers.service';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { MrcShowProfileService } from 'src/app/modules/merchant/services/rest/mrc-show-profile.service';
import { Router } from '@angular/router';
import { CpyInviteEmployeeService } from '../../services/rest/cpy-invite-employee.service';
import { CpyShowEmployeesService } from '../../services/rest/cpy-show-employees.service';
import { loadStripe } from "@stripe/stripe-js";
import { Stripe } from '@stripe/stripe-js';
 

/*  visa credit card render   */
import { render }   from 'creditcardpayments/creditCardPayments';
import { AnySrvRecord } from 'dns';

//#endregion
/* ^^^ CUSTOM IMPORTS ^^^ */

@Component({
  selector: 'app-cpy-overview',
  templateUrl: './cpy-overview.component.html',
  styleUrls: ['./cpy-overview.component.css'],
})
export class CpyOverviewComponent implements OnInit {

  showMe:boolean = false ;
  showMeicon:boolean = true;
  showMestorico:boolean = true ;
  showMewallet:boolean = false ;
  showMeprofile:boolean =false ;
  showMemat:boolean = false ;
  showMematicon:boolean = true ;
   fontwallet =  'font-family: Helvetica,sans-serif;'  ;
   fontstorico = ' Impact, Haettenschweiler, Arial Narrow Bold'  ;
   fontprofile = 'font-family: Helvetica,sans-serif;'  ;
 
  empDto: EmployeeDTO = new EmployeeDTO();
  cpyDto: CompanyDTO = new CompanyDTO();

  /* show  hide the value of current balance  */

  activeTableBodyMessage: string;
  transactionsTableBodyMessage: string;

  /* Models */
  activeVouchers: VoucherDTO[] = new Array();

  transactions: TransactionDTO[];

  /* Statuses */
  activeTableEmpty: boolean = false;
  activeTableError: boolean = false;
  activeTableLoading: boolean = false;
  transactionsTableEmpty: boolean = false;
  transactionsTableError: boolean = false;
  transactionsTableLoading: boolean = false;

  /* Values */
  endDateString: string;
  startDateString: string;
  totalActiveImport: number;

  /* visa apikey */

  apikey : string ;
  SharedSecretkey : string ;
  UserID : string ;
  password : string ;

 /* Date Range Picker for download */
 endDate: Date;
 maxDate = new Date();
 startDate: Date;

   /* VoucherDTO */
   empVouchers: VoucherDTO[];
   dtoList: DTOList<VoucherDTO>;
   vouchers: VoucherDTO[] = new Array();
 
   /* Statuses */
   tableEmpty: boolean = false;
   tableError: boolean = false;
   tableLoading: boolean = false;

   /* Messages */
   msgError: string;
   msgTableBody: string;
 
 
   /* Pagination starts here */
   selectedPage: number = 1;
   
    totalTransactions: number;
 
   totalImport: number;
 
   /* ---employee list  */


 /* Employee Email */
 empEmail: string;
 empEmailOk: boolean = false;

 /* Employee First Name */
 empFirstName: string;
 empFirstNameOk: boolean = false;

 /* Employee Last Name */
 empLastName: string;
 empLastNameOk: boolean = false;

 /* Employee Matricola */
 empMatricola: string;
 empMatricolaOk: boolean = false;

 //#endregion
 /* ^^^ FORM VALUES ^^^ */

 

 /* Models */
 dtoEmpList: DTOList<EmployeeDTO>;
 employees: EmployeeDTO[];
 selectedEmployees: Set<EmployeeDTO> = new Set();


 /* Statuses */
 inviteOk: boolean = true;

 /* sepa integration variable  */

 card : any ;
 iban: any;



   merchantsNames: Map<string, string> = new Map();
 
   constructor(
     private authenticatorService: AuthenticationService,
     private empVouchersService: EmpVouchersService,
     private mrcProfileService: MrcShowProfileService,
     private showProfileService: CpyShowProfileService,
     private cpyVouchersService: CpyVouchersService,
     private transactionsService: TransactionsService,
     private translatorService: TranslateService,
     public validatorService: ValidatorService,
     private modalManager: ModalsManagerService,
     private cpyInviteEmpService: CpyInviteEmployeeService,
     private cpyShowEmpService: CpyShowEmployeesService, 
     private router: Router,
   ) {
     /* Add Italian locale, used to format currency and date (default is 'en-US') */
     registerLocaleData(localeIt, 'it-IT');
  
   }
   handler:any = null;
   ngOnInit(): void {

    this.showProfileService.getShowProfile().subscribe((response) => {
      this.cpyDto = response;
    });

    this.checkboxClickCheckAll();
    this.enableBootstrapTooltips();
    this.showEmployeesList();
    this.loadStripe();
 
      /*
     this.showProfileService.getShowProfile().subscribe((response) => {
       this.empDto = response;
     });
      */
 
     this.getRangeLastMonth();
     this.showTransactionsList();
     this.getRangeLastMonth();
     
 
     $(function () {
       $('[data-toggle="tooltip"]').tooltip({
         trigger: 'hover',
       });
     });
   }



/*  for sepa stripe integration   */

sepaTransfer() {
  
  var s = (<any>window).StripeCheckout.configure({
    key: 'pk_test_51J7KvtDT2lXpdv5sKinjIBj8nDoGMQx0Op2fgyuGTjG9lYA2ZrVa6xrU6FFhArqCSsUKJKu7xr3kSPTqj6UI46NT00BqaITYg3',
    locale: 'auto',
  });
  var customer =  s.customers.create();

  var session = s.checkout.sessions.create({
     
    payment_method_types: ['card', 'sepa_debit'],
  
    // or you can take multiple payment methods with
    // payment_method_types: ['card', 'sepa_debit', ...]
    mode: 'setup',
    customer: customer.id,
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });
   
 }

 /* for auto reload the page */

 reloadCurrentPage() {
  this.router.navigate(['/company/cpyDashboard/sepapayment']);
 
}

/* stripe testing starts here but i do not kno*/


payment(amount: any) {    
 
  var handler = (<any>window).StripeCheckout.configure({
    key: 'pk_test_51J7KvtDT2lXpdv5sKinjIBj8nDoGMQx0Op2fgyuGTjG9lYA2ZrVa6xrU6FFhArqCSsUKJKu7xr3kSPTqj6UI46NT00BqaITYg3',
    locale: 'auto',
    
    token: function (token: any) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
      console.log(token)
      alert('Token Created!!');
    }
  });

/* handler to open the pop up modal */
  handler.open({
    name: 'Monetic Application',
    description: 'Visa Credit Transfer',
    amount: amount * 100
  });

}

/*  loadstripe function for testing  API  and generation token using javascript integration 
*/

loadStripe() {
   
  if(!window.document.getElementById('stripe-script')) {
    var s = window.document.createElement("script");
    s.id = "stripe-script";
    s.type = "text/javascript";
    s.src = "https://checkout.stripe.com/checkout.js";
    s.onload = () => {
      this.handler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_51HxRkiCumzEESdU2Z1FzfCVAJyiVHyHifo0GeCMAyzHPFme6v6ahYeYbQPpD9BvXbAacO2yFQ8ETlKjo4pkHSHSh00qKzqUVK9',
        locale: 'auto',
        token: function (token: any) {

          // You can access the token ID with `token.id`. see the other tutriallink :  https://www.youtube.com/watch?v=eCGb3U3ua6Y

          // Get the token ID to your server-side code for use. it is going to be in the backend side

          console.log(token)
          alert('Payment Successfully done!!');
        }
      });
    }
      window.document.body.appendChild(s);
  }
}

 /* Allow checkbox 'cpy-employee-check-all' to check and uncheck all other checkboxes */
    checkboxClickCheckAll() {
      /* Assign onClick event to check all checkboxes, then trigger 'change' event of every single checkbox */
      $('#cpy-employee-check-all').click(function () {
        $('input:checkbox').prop('checked', this.checked);
        $('input:checkbox')
          .not(this)
          .each(function () {
            $(this)[0].dispatchEvent(new Event('change'));
          });
      });
    }
    
  /* Ngx-pagination page change event */
  onPageChange() {
    /* Need a little timeout when changing page with pagination, otherwise changes will be applied to previous page */
    setTimeout(() => {
      /*
        Control whether the employee was previously selected, then check the relative checkbox.
        TODO: Doesn't seem very optimized, need a second look.
      */
      this.selectedEmployees.forEach((emp) => {
        $('input:checkbox').each(function () {
          if (emp.usrId === $(this).val()) {
            $(this).prop('checked', true);
          }
        });
      });

      /* Checkbox 'check-all' is checked if every other checkbox is checked */
      if (
        $('input:checkbox').not('#cpy-employee-check-all').not(':checked')
          .length === 0
      ) {
        $('#cpy-employee-check-all').prop('checked', true);
      } else {
        $('#cpy-employee-check-all').prop('checked', false);
      }
    }, 1);
  }
 
  /* Enable Bootstrap Tooltips */
  enableBootstrapTooltips() {
    /*
      FIXME: Non sembra funzionare con ngx-translate.
      La causa sembra dovuta ad un ritardo nel riempire con le "traduzioni".
      Possibile soluzione: https://github.com/ngx-translate/core/issues/517#issuecomment-299637956
    */
    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });
  }


 /* Fill the employees table */
 showEmployeesList() {
  /* Show loading spinner */
  this.tableLoading = true;
 /* Get employees list from rest service */
  this.cpyShowEmpService.showEmployeesList().subscribe(
    (response) => {
      /* Hide loading spinner */
      this.tableLoading = false;

      if (response.status === 'OK') {
        /* Assign response to a DTOList variable */
        this.dtoEmpList = response;

        /* Assign response list to an array of EmployeesDTO */
        this.employees = response.list;

        /* Check whether array is empty or not */
        if (!Array.isArray(this.employees) || !this.employees.length) {
          /* Show empty list message in table body */
          this.msgTableBody = this.translatorService.instant(
            'EMPLOYEES.TABLE_EMPTY'
          );

          this.tableEmpty = true;
        } else {
          this.tableEmpty = false;
        }
      } else {
        /* Show error message in table body in case of no specific error ('Generic Error') */
        this.msgTableBody = this.translatorService.instant('ERRORS.GENERIC');

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


/*  visa checkout button function integration  */

 onVisaCheckoutReady(){
  V.init( {
  apikey: "S9YZR3TF6XZVW2FS58XO21Wz6oPFz_GYD1kd7beltouYaLV5g" ,   /*  just to test visa api for sample project sandbox  */
  encryptionKey: "5CPWBM0H6YE6NDXDY1F413H49LVyUo6Oo-n0r1gf-QQpY7yQQ",           /*  the encription key will be provided by visa developer sandbox visa  checkout*/   
  paymentRequest:{
    currencyCode: "EURO",
    subtotal: "21.70"
  }
  });
V.on("payment.success", function(payment)   //    when payment successful 
  {alert(JSON.stringify(payment)); });  
V.on("payment.cancel", function(payment)    // when payment cancel 
  {alert(JSON.stringify(payment)); });
V.on("payment.error", function(payment, error)  // when payment error 
  {alert(JSON.stringify(error)); });
}

/* vvv METHODS vvv */
//#region
/* Create a Transaction Request DTO to get list of transaction in specific time period */
/* Transform a Date object into a string formatted as 'yyyy-MM-dd' */
dateToString(date: Date): string {
  if (date) {
    return (
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
  }
}
/* chat box funtion starts here  */
 openForm() {
  document.getElementById("myForm").style.display = "block";
}

closeForm() {
  document.getElementById("myForm").style.display = "none";
}

   /*  show the hidden current balance  */
 
   toogleTag() {
 
     this.showMe = !this.showMe; 
     this.showMeicon=!this.showMeicon;
    }
 
   toogleTagaddress (){
    this.showMemat =!this.showMemat ;
   this.showMematicon=!this.showMematicon;
   }
   
   tooglestorico(){
 
     this.showMestorico = !this.showMestorico ;
     this.showMewallet = false ;
     this.showMeprofile=false;
     this.fontstorico = this.fontstorico ==='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' ? 'Times New Roman' : 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif'
     this.fontwallet =  ' Helvetica,sans-serif'  ;
     this.fontprofile=  ' Helvetica,sans-serif'  ;
   }
 
   tooglewallet() {
     this.showMewallet= !this.showMewallet; 
     this.showMestorico = false ;
     this.showMeprofile = false ;
     this.fontwallet = this.fontwallet ==='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' ? 'Times New Roman' : 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif'
     this.fontstorico =  'Helvetica,sans-serif'  ;
     this.fontprofile=  'Helvetica,sans-serif'  ;
   }
 
 
 
   toogleprofile  (){
     
     this.showMeprofile = !this.showMeprofile ;
     this.showMestorico = false ;
     this.showMewallet = false ;
     this.fontprofile = this.fontprofile ==='Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' ? 'Times New Roman' : 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif'
   
     this.fontwallet =  'Helvetica,sans-serif'  ;
     this.fontstorico=  'Helvetica,sans-serif'  ;
   }
 
 
 
  /* Calculate the active total import */
  calculateTotalActiveImport() {
    this.totalActiveImport = 0;

    this.activeVouchers.forEach((vch) => {
      this.totalActiveImport += Number(vch.vchValue) * Number(vch.vchQuantity);
    });
  }

  /* Create a Transaction Request DTO to get list of transaction in specific time period */
  createTransactioRequestDTO(): TransactionRequestDTO {
    const trcRequestDTO: TransactionRequestDTO = new TransactionRequestDTO();

    trcRequestDTO.startDate = this.startDateString;
    trcRequestDTO.endDate = this.endDateString;
    trcRequestDTO.usrId = this.authenticatorService.getLoggedUserId();
    trcRequestDTO.profile = 'company';

    return trcRequestDTO;
  }

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

  /* Fill the active vouchers table */
  showActiveVouchers() {
    /* Show loading spinner */
    this.activeTableLoading = true;

    /* Get purchasable vouchers list from rest service */
    this.cpyVouchersService.showActiveVouchers().subscribe(
      (response) => {
        /* Hide loading spinner */
        this.activeTableLoading = false;

        if (response.status === 'OK') {
          /* Assign response list to an array of VouchersDTO */
          this.activeVouchers = [...response.list];

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

            this.activeVouchers.splice(4);
          }
        } else {
          /* Show error message in active vouchers table body in case of no specific HTTP error ('Generic Error') */
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

   /*Export currently shown transactions into a XLSX file  and all details */
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
  
  /*visa apikey reating restAPI to call backend */
  
  visatransactionapikey() {
     
    this.transactionsService
      .visaapikey(this.createTransactioRequestDTO())
      .subscribe(
        (response) => {
          if (response.status === 'OK') {

           /* all the visa apikey sharedsecretkey and certificate will be here optional  */ 

           
              
          } else {
            /* Show error messages ('Generic Error') show in pop up*/
            this.modalManager.errorsModalGeneric(
              'Errore in visa apikey and sharedsecret ',
              'ERRORS.GENERIC'
            );
          }
        },
        (error) => {
          /*  Show error messages ('Generic HTTP Error') show in pop up  */
          this.modalManager.errorsModalGeneric(
            'Errore in visa api key and sharedsecret ',
            'ERRORS.GENERIC'
          );
        }
      );
   }
}
