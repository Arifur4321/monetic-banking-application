/* Default Imports */
import { Component, OnDestroy, OnInit } from '@angular/core';

/* Custom Imports */
import * as myMessages from 'src/globals/messages';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmpLoginService } from '../../services/rest/emp-login.service';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { Router } from '@angular/router';
import { ValidatorService } from 'src/app/services/validator.service';
import { environment } from 'src/environments/environment';

/* jQuery */
declare var $: any;

@Component({
  selector: 'app-emp-login',
  templateUrl: './emp-login.component.html',
  styleUrls: ['./emp-login.component.css'],
})
export class EmpLoginComponent implements OnInit, OnDestroy {
  /* Input fields */
  email: string;
  password: string;

  /* EmployeeDTO */
  empDTO: EmployeeDTO = new EmployeeDTO();
  employee: EmployeeDTO = new EmployeeDTO();

  /* Errors */
  loginFail: boolean = false;
  errorGeneric: boolean = false;

  /* Validations */
  emailOk: boolean;
  passwordOk: boolean;

  /* Homepage Link */
  homepage: string = environment.homeUrl;

  constructor(
    private empLoginService: EmpLoginService,
    private route: Router,
    private validatorService: ValidatorService,
    private authenticatorService: AuthenticationService
  ) {}

  ngOnInit(): void {
    /* Clear Session */
    this.authenticatorService.clearSessionStorage();

    $(function () {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover',
      });
    });
  }

  ngOnDestroy(): void {
    /* Hide Bootstrap Tooltips when switch component/page */
    $(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  /* Check if the email is formatted correctly (see ValidatorService method) */
  checkEmail() {
    this.emailOk = this.validatorService.isValidEmail(this.email);

    /* Apply Bootstrap is-invalid/is-valid classes based on validation status */
    if (!this.emailOk) {
      $('input[name*="email"]').removeClass('is-valid');
      $('input[name*="email"]').addClass('is-invalid');
    } else {
      $('input[name*="email"]').removeClass('is-invalid');
      $('input[name*="email"]').addClass('is-valid');
    }
  }

  /* Just check if the password is not empty (see ValidatorService method) */
  checkPassword() {
    this.passwordOk = this.validatorService.isNotEmpty(this.password);

    if (!this.passwordOk) {
      $('input[name*="password"]').removeClass('is-valid');
      $('input[name*="password"]').addClass('is-invalid');
    } else {
      $('input[name*="password"]').removeClass('is-invalid');
      $('input[name*="password"]').addClass('is-valid');
    }
  }

  /* General validations check, usually done before proceeding with form */
  checkLoginForm(): boolean {
    this.checkEmail();
    this.checkPassword();

    /* If validation doesn't pass for one or more inputs, show tooltip for the relative input */
    if (!this.emailOk) {
      $('.tooltip').tooltip('hide');
      $('input[name*="email"]').tooltip('show');
    } else if (!this.passwordOk) {
      $('.tooltip').tooltip('hide');
      $('input[name*="password"]').tooltip('show');
    }
    return this.emailOk && this.passwordOk;
  }

  /* Submit login form */
  onSubmitLoginForm() {
  /* Reset errors alerts */
    this.errorGeneric = false;
    this.loginFail = false;

  /* Validate the login form */
    if (this.checkLoginForm()) {

    /* Create a simple EmployeeDTO with the email and the password */
      this.employee.usrEmail = this.email;
      this.employee.usrPassword = this.password;
      this.empLoginService.authLoginEmp(this.employee).subscribe(
        (response) => {
        /* Assign the response to a CompanyDTO variable */
          this.empDTO = response;

          if (this.empDTO.status === 'OK') {

          /* Add these values to the sessionStorage, they're used to store user info */
            this.authenticatorService.setUserSession(this.empDTO.usrId);
            this.authenticatorService.setEmailSession(this.empDTO.usrEmail);
            this.authenticatorService.setProfile('company');
            this.authenticatorService.setSessionId();

          /* Navigate user to the dashboard */
            this.route.navigate(['employee/empDashboard']);
          } else if (this.empDTO.errorDescription === myMessages.noUserFound) {
            this.loginFail = true;
          } else {
            this.errorGeneric = true;
          }
        },
        (error) => {
          /* Error alert in case of no specific HTTP error ('Generic Error') */
          this.errorGeneric = true;
        }
      );
    }
  }
}
