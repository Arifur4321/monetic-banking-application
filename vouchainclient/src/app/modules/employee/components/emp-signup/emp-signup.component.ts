import { Component, OnInit, Input } from '@angular/core';

/* --- CUSTOM IMPORTS --- */
/* FontAwesome */
import {
  faExclamationCircle,
  faInfoCircle,
  faArrowRight,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

/* jQuery */
declare var $: any;

/* Models */
import { EmployeeDTO } from 'src/app/model/employee-dto';

/* Router */
import { Router } from '@angular/router';

/* Services */
import { EmpSignupService } from '../../services/rest/emp-signup.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { TranslateService } from '@ngx-translate/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-emp-signup',
  templateUrl: './emp-signup.component.html',
  styleUrls: ['./emp-signup.component.css'],
})
export class EmpSignupComponent implements OnInit {
  /* FontAwesome Icons */
  faExclamationCircle = faExclamationCircle;
  faInfoCircle = faInfoCircle;
  faForwardArrow = faArrowRight;
  faBackArrow = faArrowLeft;

  /* --- FORM VALUES --- */

  /* Email */
  email: string;

  /* First & Last Name */
  firstNameRef: string;
  lastNameRef: string;

  /* Password */
  passOk: boolean = true;
  passOkButton: boolean = false;
  password: string;

  /* Retype Password */
  passReOk: boolean = true;
  passReOkButton: boolean = false;
  passwordRetype: string;

  /* Matricola */
  matricola: string;

  msgSignupButton: string;

  /* Terms & Conditions */
  termsAndCond: boolean;

  /* Models */
  employeeToSignup: EmployeeDTO;

  /* Messages */
  msgSignupBody: string;
  msgSignupBodyShow: boolean = false;

  /* Status */
  signupOk: boolean = false;

  /* Homepage Link */
  homepage: string = environment.homeUrl;

  constructor(
    private empSignupService: EmpSignupService,
    private route: Router,
    private validatorService: ValidatorService,
    private translatorService: TranslateService
  ) {
    if (
      this.route.getCurrentNavigation() !== null &&
      this.route.getCurrentNavigation().extras.state !== undefined
    ) {
      this.employeeToSignup = this.route.getCurrentNavigation().extras.state.employee;
    } else {
      /* Redirect to Dashboard */
      this.route.navigate(['/employee']);
    }
  }

  ngOnInit(): void {
    /* Enable Bootstrap Tooltips */
    /* FIXME: Non sembra funzionare con ngx-translate.
        La causa sembra dovuta ad un ritardo nel riempire con le "traduzioni" */
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
    $('#btn-emp-sign-submit span').hide();
    this.msgSignupButton = this.translatorService.instant(
      'SIGNUP.SIGNUP_LABEL'
    );
    $('#msgErrorAlert').hide();
    $('#emp-signup-form').show();

    $('#btn-emp-sign-submit').attr('disabled', true);
  }

  /* --- METHODS --- */

  checkForm(): boolean {
    return this.passOk && this.passReOk;
  }

  checkPassword() {
    this.passOk = this.validatorService.isValidPassword(this.password);
    this.passOkButton = this.validatorService.isValidPassword(this.password);
    this.onInputFieldsPasswords();
  }

  checkPasswordRe() {
    this.passReOk = this.validatorService.isValidPassRe(
      this.password,
      this.passwordRetype
    );
    this.passReOkButton = this.validatorService.isValidPassRe(
      this.password,
      this.passwordRetype
    );
    this.onInputFieldsPasswords();
  }

  /* Changes the button color */
  onInputFieldsPasswords() {
    if (
      this.passOkButton &&
      this.passReOkButton &&
      $('#termsCheckbox').prop('checked')
    ) {
      $('#btn-emp-sign-submit')
        .removeClass('btn-secondary')
        .addClass('btn-primary')
        .attr('disabled', false);
    } else {
      $('#btn-emp-sign-submit')
        .removeClass('btn-primary')
        .addClass('btn-secondary')
        .attr('disabled', true);
    }
  }

  /*Submit Form*/
  onFormSubmit() {
    if (this.checkForm()) {
      /* Show a 'static' Modal (user can't close it by clicking outside or pressing on the keyboard) */
      $('#modalConfirmSignup').modal({ backdrop: 'static', keyboard: false });
      $('#modalConfirmSignup').modal('show');
      $('#btn-emp-sign-submit span').show();
    /* Unhide the loading icon */
      this.msgSignupButton = this.translatorService.instant(
        'SIGNUP.MODAL.LOADING_BUTTON'
      );
      $('#btn-emp-sign-submit').prop('disabled', true);
      this.employeeToSignup.usrPassword = this.password;
      this.empSignupService
        .employeeSignup(this.employeeToSignup)
        .subscribe((response) => {

        /* Assign the response DTO to an attribute DTO */
          let employeeSigned = response;
        /* Check if registration is successful */
          if (employeeSigned.status === 'OK') {

          /* Show instructions for successful registration */
            this.signupOk = true;
            this.msgSignupBodyShow = true;
            this.msgSignupBody = this.translatorService.instant(
              'SIGNUP.MODAL.RESPONSE_BODY_EMP_OK'
            );
            this.msgSignupButton = this.translatorService.instant(
              'SIGNUP.MODAL.GO_LOGIN'
            );
          /* Hide loading icon and enable the 'Go to login' button */
            $('#btn-modal-close span').hide();
            $('#btn-modal-close').removeAttr('disabled');
          } else {
            /* Closes modal */
            $('#modalConfirmSignup').modal('hide');
            /* Hide content and shows error */
            $('#msgErrorAlert').show();
            $('#emp-signup-form').hide();
          }
        },
          () => {
            /* Show error messages ('Generic HTTP Error') */
            this.msgSignupBodyShow = true;
            this.msgSignupBody = this.translatorService.instant(
              'ERRORS.GENERIC'
            );
            this.msgSignupButton = this.translatorService.instant(
              'SIGNUP.MODAL.RETRY'
            );
            /* Hide loading icon and enable the 'Go to login' button */
            $('#btn-modal-close span').hide();
            $('#btn-modal-close').removeAttr('disabled');
          }
        );
    }
  }

  goLogin() {
    /* Check whether signup went okay or not */
    if (this.signupOk) {
      /* Hide modal before going to login page */
      $('#modalConfirmSignup').modal('hide');

      this.route.navigate(['employee/empLogin']);
    } else {
      $('#modalConfirmSignup').modal('hide');
    }
  }

  retry() {
    this.route.navigate(['employee/empInvitationCode']);
  }
}
