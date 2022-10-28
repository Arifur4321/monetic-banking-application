/* --- DEFAULTS IMPORTS --- */
import { Component, OnDestroy, OnInit } from '@angular/core';

/* vvv CUSTOM IMPORTS vvv */

/* Custom Messages */
import * as myMessages from 'src/globals/messages';

/* Environment */
import { environment } from 'src/environments/environment';

/* jQuery */
declare var $: any;

/* Models */
import { CompanyDTO } from 'src/app/model/company-dto';

/* Router */
import { Router } from '@angular/router';

/* Services */
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CpyLoginService } from '../../services/rest/cpy-login.service';
import { ValidatorService } from 'src/app/services/validator.service';

/* ^^^ CUSTOM IMPORTS ^^^ */

@Component({
  selector: 'app-cpy-login',
  templateUrl: './cpy-login.component.html',
  styleUrls: ['./cpy-login.component.css'],
})
export class CpyLoginComponent implements OnDestroy, OnInit {
  /* vvv ATTRIBUTES vvv */

  /* vvv FORM VALUES vvv */

  /* Inputs */
  email: string;
  password: string;

  /* Errors Alerts */
  errorGeneric: boolean = false;
  loginFail: boolean = false;

  /* Validations */
  emailOk: boolean;
  passwordOk: boolean;

  /* ^^^ FORM VALUES ^^^ */

  /* Models */
  cpyDTO: CompanyDTO;
  cpyDTORequest: CompanyDTO = new CompanyDTO();

  /* Values */
  homepage: string = environment.homeUrl;

  /* ^^^ ATTRIBUTES ^^^ */

  constructor(
    private authenticatorService: AuthenticationService,
    private cpyLoginService: CpyLoginService,
    private route: Router,
    private validatorService: ValidatorService
  ) {}

  ngOnInit(): void {
    /* TODO: da controllare */
    /* Used to logout user from the session */
    this.authenticatorService.clearSessionStorage();

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

  ngOnDestroy(): void {
    /* Hide Bootstrap Tooltips when switch component/page */
    $(function () {
      $('.tooltip').tooltip('hide');
    });
  }

  /* vvv METHODS vvv */

  /* Submit the login form */
  onSubmitLoginForm() {
    /* Reset errors alerts */
    this.errorGeneric = false;
    this.loginFail = false;

    /* Validate the login form */
    if (this.checkLoginForm()) {
      /* Create a simple CompanyDTO with the email and the password */
      this.cpyDTORequest.usrEmail = this.email;
      this.cpyDTORequest.usrPassword = this.password;

      this.cpyLoginService.authLoginCpy(this.cpyDTORequest).subscribe(
        (response) => {
          /* Assign the response to a CompanyDTO variable */
          this.cpyDTO = response;

          /* Check response status */
          if (this.cpyDTO.status === 'OK') {
            /* Add these values to the sessionStorage, they're used to store user info */
            this.authenticatorService.setUserSession(this.cpyDTO.usrId);
            this.authenticatorService.setEmailSession(this.cpyDTO.usrEmail);
            this.authenticatorService.setProfile('company');
            this.authenticatorService.setSessionId();

            /* Check if it's first login */
            if (this.cpyDTO.cpyContractChecked === 'true') {
              /* Navigate user to the dashboard */
              this.route.navigate(['company/cpyDashboard']);
            } else if (this.cpyDTO.cpyContractChecked === 'false') {
              /* Navigate user to upload a contract */
              this.route.navigate(['company/cpyUploadCtr']);
            }
          } else if (this.cpyDTO.errorDescription === myMessages.noUserFound) {
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
      $('input[name*="email"]').removeClass('is-valid');
      $('input[name*="email"]').addClass('is-invalid');
    } else {
      $('input[name*="email"]').removeClass('is-invalid');
      $('input[name*="email"]').addClass('is-valid');
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

  /* ^^^ VALIDATIONS ^^^ */

  /* ^^^ METHODS ^^^ */
}
