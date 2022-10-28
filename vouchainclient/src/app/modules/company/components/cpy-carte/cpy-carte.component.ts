/*default import */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators ,FormGroup , FormsModule} from '@angular/forms';

/* Custom Messages */
import * as myMessages from 'src/globals/messages';
/* jQuery */
declare var $: any;
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

import { MatDialog , MatDialogConfig}  from '@angular/material/dialog' ;
import { CpyEmployeesComponent } from '../cpy-employees/cpy-employees.component';



@Component({
  selector: 'app-cpy-carte',
  templateUrl: './cpy-carte.component.html',
  styleUrls: ['./cpy-carte.component.css']
})
export class CpyCarteComponent implements OnInit {

 
 /* vvv ATTRIBUTES vvv */
  //#region

  /* vvv FORM VALUES vvv */
  //#region

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

  /* Messages */
  msgTableBody: string;

  /* Models */
  dtoEmpList: DTOList<EmployeeDTO>;
  employees: EmployeeDTO[];
  selectedEmployees: Set<EmployeeDTO> = new Set();

  /* Pagination */
  selectedPage: number = 1;

  /* Statuses */
  inviteOk: boolean = true;
  tableEmpty: boolean = false;
  tableError: boolean = false;
  tableLoading: boolean = false;

  //#endregion
  /* ^^^ ATTRIBUTES ^^^ */

  constructor(
    private authenticatorService: AuthenticationService,
    private cpyInviteEmpService: CpyInviteEmployeeService,
    private cpyShowEmpService: CpyShowEmployeesService,
    private modalManager: ModalsManagerService,
    private router: Router,
    private translatorService: TranslateService,
    private validatorService: ValidatorService
  ) {}

  ngOnDestroy(): void {
    this.hideBootstrapTooltips();
    this.resetErrorModal();
  }

  ngOnInit(): void {
    this.checkboxClickCheckAll();
    this.enableBootstrapTooltips();
    this.showEmployeesList();
  }

  /* vvv METHODS vvv */
  //#region

  /* Create an EmployeeDTO using the form's inputs values, then push it to a new Employees Array */
  addEmployeeDTO(): EmployeeDTO[] {
    let employeeDTO: EmployeeDTO = new EmployeeDTO();
    let employeesList: EmployeeDTO[] = new Array();

    employeeDTO.empFirstName = this.empFirstName;
    employeeDTO.empLastName = this.empLastName;
    employeeDTO.empMatricola = this.empMatricola;
    employeeDTO.usrEmail = this.empEmail;
    employeeDTO.cpyUsrId = this.authenticatorService.getLoggedUserId();

    employeesList.push(employeeDTO);

    return employeesList;
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

  /* Reset the invite form inputs to default values and remove Bootstrap is-invalid/is-valid classes */
  clearInviteFormInputs() {
    this.empFirstName = '';
    this.empLastName = '';
    this.empMatricola = '';
    this.empEmail = '';

    $('input[name*="empFirstName"]').removeClass('is-invalid is-valid');
    $('input[name*="empLastName"]').removeClass('is-invalid is-valid');
    $('input[name*="empMatricola"]').removeClass('is-invalid is-valid');
    $('input[name*="empEmail"]').removeClass('is-invalid is-valid');
  }

  /* Create and show an error modal with specified title and body (using i18n keys) */
  createErrorModal(i18nKeyForTitle: string, i18nKeyForBody: string) {
    this.modalManager.errorsModalGeneric(i18nKeyForTitle, i18nKeyForBody);
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

  /* Hide Bootstrap Tooltips, usually when switching component/page */
  hideBootstrapTooltips() {
    $(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  /* Reset and hide error modal */
  resetErrorModal() {
    this.modalManager.errorsModalReset();
  }

  /* Reset navbar CSS */
  resetNavbarCss() {
    $('body').css('background-color', '#fbf8f3');
    $('#cpy-navbar a').css('color', 'white');
    $('#cpy-navbar-profile').addClass('text-white').css('color', '');
    $('#cpy-navbar-profile span').addClass('text-white').css('color', '');
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

  /* vvv EVENTS vvv */
  //#region

  /* Add an employee to selectedEmployees Set() (used for buying vouchers) when checking the relative checkbox */
  onChangeEmployeeCheckbox(event, employee) {
    /* Check whether the checkbox is checked or not */
    if (event.target.checked) {
      /* If checked add relative employee to array */
      this.selectedEmployees.add(employee);
    } else {
      /* Else remove relative employee to array (if present) */
      this.selectedEmployees.delete(employee);
    }

    /* Checkbox 'check-all' is checked if every other checkbox is checked */
    if (
      $('input:checkbox').not('#cpy-employee-check-all').not(':checked')
        .length === 0
    ) {
      $('#cpy-employee-check-all').prop('checked', true);
    } else {
      $('#cpy-employee-check-all').prop('checked', false);
    }
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

  

  /* Send Vouchers Button */
  onSubmitSendVouchers() {
    /* Check if the selectedEmployees array is not empty */
    if (this.selectedEmployees.size) {
      /* Navigate to cpy-vouchers component with the array */
      this.router.navigate(['company/cpyDashboard/vouchers'], {
        state: { checkedEmps: this.selectedEmployees },
      });
    } else {
      /* Show error message ('No Employee Selected') */
      this.createErrorModal(
        'MODALS.HEADER.EMPLOYEES.ERRORS.SEND_VOUCHERS_TITLE',
        'ERRORS.NO_EMP_SELECTED'
      );
    }
  }



  
  /* Submit Invite Form */
  onSubmitInviteForm() {
    let newEmpModal = $('#cpy-employees-modal-new-employee');

    if (this.checkInviteForm()) {
      this.inviteOk = false;

      this.cpyInviteEmpService.inviteEmployee(this.addEmployeeDTO()).subscribe(
        (response) => {
          if (response.status === 'OK') {
            newEmpModal.modal('hide');

            this.modalManager.successModalGeneric(
              'MODALS.HEADER.EMPLOYEES.SUCCESS.INV_EMP',
              'MODALS.BODY.EMPLOYEES.SUCCESS.INV_EMP'
            );

            this.employees = [];

            /* Show the up-to-date employees list */
            this.showEmployeesList();
          } else if (
            response.errorDescription === myMessages.emailAlreadyExist
          ) {
            newEmpModal.modal('hide');

            /* Show error messages ('Email already exist') */
            this.createErrorModal(
              'MODALS.HEADER.EMPLOYEES.ERRORS.SEND_INVITE_TITLE',
              'ERRORS.EMAIL_ALREADY_EXIST'
            );
          } else {
            newEmpModal.modal('hide');

            /* Show error messages ('Generic Error') */
            this.createErrorModal(
              'MODALS.HEADER.EMPLOYEES.ERRORS.SEND_INVITE_TITLE',
              'ERRORS.GENERIC'
            );
          }

          /* Reset inputs to default status */
          this.clearInviteFormInputs();

          this.inviteOk = true;
        },
        (error) => {
          newEmpModal.modal('hide');

          /* Show error messages ('Generic Error') */
          this.createErrorModal(
            'MODALS.HEADER.EMPLOYEES.ERRORS.SEND_INVITE_TITLE',
            'ERRORS.GENERIC'
          );
        }
      );
    }
  }

  //#endregion
  /* ^^^ EVENTS ^^^ */

  /* vvv VALIDATIONS vvv */
  //#region

  /* Check if the email is formatted correctly (see ValidatorService method) */
  checkEmpEmail() {
    this.empEmailOk = this.validatorService.isValidEmail(this.empEmail);

    /* Apply Bootstrap is-invalid/is-valid classes based on validation status */
    if (!this.empEmailOk) {
      $('input[name*="empEmail"]').removeClass('is-valid');
      $('input[name*="empEmail"]').addClass('is-invalid');
    } else {
      $('input[name*="empEmail"]').removeClass('is-invalid');
      $('input[name*="empEmail"]').addClass('is-valid');
    }
  }

  /* Just check if the employee first name is not empty (see ValidatorService method) */
  checkEmpFirstName() {
    this.empFirstNameOk = this.validatorService.isNotEmpty(this.empFirstName);

    /* Apply Bootstrap is-invalid/is-valid classes based on validation status */
    if (!this.empFirstNameOk) {
      $('input[name*="empFirstName"]').removeClass('is-valid');
      $('input[name*="empFirstName"]').addClass('is-invalid');
    } else {
      $('input[name*="empFirstName"]').removeClass('is-invalid');
      $('input[name*="empFirstName"]').addClass('is-valid');
    }
  }

  /* Just check if the employee last name is not empty (see ValidatorService method) */
  checkEmpLastName() {
    this.empLastNameOk = this.validatorService.isNotEmpty(this.empLastName);

    /* Apply Bootstrap is-invalid/is-valid classes based on validation status */
    if (!this.empLastNameOk) {
      $('input[name*="empLastName"]').removeClass('is-valid');
      $('input[name*="empLastName"]').addClass('is-invalid');
    } else {
      $('input[name*="empLastName"]').removeClass('is-invalid');
      $('input[name*="empLastName"]').addClass('is-valid');
    }
  }

  /* Just check if the employee serial number is not empty (see ValidatorService method) */
  checkEmpMatricola() {
    this.empMatricolaOk = this.validatorService.isNotEmpty(this.empMatricola);

    /* Apply Bootstrap is-invalid/is-valid classes based on validation status */
    if (!this.empMatricolaOk) {
      $('input[name*="empMatricola"]').removeClass('is-valid');
      $('input[name*="empMatricola"]').addClass('is-invalid');
    } else {
      $('input[name*="empMatricola"]').removeClass('is-invalid');
      $('input[name*="empMatricola"]').addClass('is-valid');
    }
  }

  /* General validations check, usually done before proceeding with form */
  checkInviteForm(): boolean {
    this.checkEmpEmail();
    this.checkEmpFirstName();
    this.checkEmpLastName();
    this.checkEmpMatricola();

    /* If validation doesn't pass for one or more inputs, show tooltip for the relative input */
    if (!this.empFirstNameOk) {
      $('.tooltip').tooltip('hide');
      $('input[name*="empFirstName"]').tooltip('show');
    } else if (!this.empLastNameOk) {
      $('.tooltip').tooltip('hide');
      $('input[name*="empLastName"]').tooltip('show');
    } else if (!this.empMatricolaOk) {
      $('.tooltip').tooltip('hide');
      $('input[name*="empMatricola"]').tooltip('show');
    } else if (!this.empEmailOk) {
      $('.tooltip').tooltip('hide');
      $('input[name*="empEmail"]').tooltip('show');
    }

    return (
      this.empEmailOk &&
      this.empFirstNameOk &&
      this.empLastNameOk &&
      this.empMatricolaOk
    );
  }

  //#endregion
  /* ^^^ VALIDATIONS ^^^ */

  //#endregion
  /* ^^^ METHODS ^^^ */

}
