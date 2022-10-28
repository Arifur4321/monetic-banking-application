/* Default Imports */
import { Component, OnDestroy, OnInit } from '@angular/core';

/* Custom Imports */
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { MrcLoginService } from '../../services/rest/mrc-login.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

/* Custom Messages */
import * as myMessages from 'src/globals/messages';
import { ValidatorService } from 'src/app/services/validator.service';

/* jQuery */
declare var $: any;

/* Environment */
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mrc-login',
  templateUrl: './mrc-login.component.html',
  styleUrls: ['./mrc-login.component.css'],
})
export class MrcLoginComponent implements OnDestroy, OnInit {
  /* Inputs */
  email: string;
  password: string;

  /* Models */
  mrcDTO: MerchantDTO;
  mrcDTORequest: MerchantDTO = new MerchantDTO();

  /* Errors Alerts */
  errorGeneric: boolean = false;
  loginFail: boolean = false;

  /* Validations */
  emailOk: boolean;
  passwordOk: boolean;

  /* Homepage Link */
  homepage: string = environment.homeUrl;

  constructor(
    private mrcLoginService: MrcLoginService,
    private route: Router,
    private authenticatorService: AuthenticationService,
    private validatorService: ValidatorService
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

  checkLoginFormMrc() {
    /* Reset errors alerts */
    this.errorGeneric = false;
    this.loginFail = false;

    /* Validate the login form */
    if (this.checkLoginForm()) {
      /* Create a simple CompanyDTO with the email and the password */
      this.mrcDTORequest.usrEmail = this.email;
      this.mrcDTORequest.usrPassword = this.password;
      this.mrcLoginService.authLoginMrc(this.mrcDTORequest).subscribe(
        (response) => {
          /* Assign the response to a CompanyDTO variable */
          this.mrcDTO = response;

          /* Check response status */
          if (this.mrcDTO.status === 'OK') {
            /* Add these values to the sessionStorage, they're used to store user info */
            this.authenticatorService.setUserSession(this.mrcDTO.usrId);
            this.authenticatorService.setEmailSession(this.mrcDTO.usrEmail);
            this.authenticatorService.setProfile('merchant');
            this.authenticatorService.setSessionId();

            /* Navigate to dashboard */
            this.route.navigate(['merchant/mrcDashboard']);
          } else if (this.mrcDTO.errorDescription === myMessages.noUserFound) {
            /* Error alert if no user has been found ('User Not Found') */
            this.loginFail = true;
          } else {
            /* Error alert in case of no specific error ('Generic Error') */
            this.errorGeneric = true;
          } /* TODO: Effettuare eventuali altri controlli in caso di altri errori specifici */
        },
        (error) => {
          /* Error alert in case of no specific HTTP error ('Generic Error') */
          this.errorGeneric = true;
        }
      );
    }
  }

  /* vvv VALIDATIONS vvv */

  /* Check if the email is formatted correctly (see ValidatorService method) */
  checkEmail() {
    this.emailOk = this.validatorService.isValidEmail(this.email);

    /* Apply Bootstrap is-invalid/is-valid classes based on validation status */
    if (!this.emailOk) {
      $("input[name*='email']").removeClass('is-valid');
      $("input[name*='email']").addClass('is-invalid');
    } else {
      $("input[name*='email']").removeClass('is-invalid');
      $("input[name*='email']").addClass('is-valid');
    }
  }

  /* General validations check, usually done before proceeding with form */
  checkLoginForm(): boolean {
    this.checkEmail();
    this.checkPassword();

    /* If validation doesn't pass for one or more inputs, show tooltip for the relative input */
    if (!this.emailOk) {
      $('.tooltip').tooltip('hide');
      $("input[name*='email']").tooltip('show');
    } else if (!this.passwordOk) {
      $('.tooltip').tooltip('hide');
      $("input[name*='password']").tooltip('show');
    }

    return this.emailOk && this.passwordOk;
  }

  /* Just check if the password is not empty (see ValidatorService method) */
  checkPassword() {
    this.passwordOk = this.validatorService.isNotEmpty(this.password);

    if (!this.passwordOk) {
      $("input[name*='password']").removeClass('is-valid');
      $("input[name*='password']").addClass('is-invalid');
    } else {
      $("input[name*='password']").removeClass('is-invalid');
      $("input[name*='password']").addClass('is-valid');
    }
  }
}
