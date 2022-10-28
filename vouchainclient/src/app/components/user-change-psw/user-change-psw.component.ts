import { Component, OnInit } from '@angular/core';

/* --- CUSTOM IMPORTS --- */

/* Custom Messages */
import * as myMessages from 'src/globals/messages';

/* Models */
import { CompanyDTO } from 'src/app/model/company-dto';
import { PasswordDTO } from './../../model/password-dto';

/* Router */
import { Router } from '@angular/router';

/* Services */
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { UserPasswordRecoveryService } from 'src/app/services/rest/user-password-recovery.service';

/* jQuery */
declare var $: any;

/* Environment */
import { environment } from 'src/environments/environment';

/* FontAwesome */
import {
  faArrowLeft,
  faArrowRight,
  faExclamationCircle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { VerifySessionService } from 'src/app/services/rest/verify-session.service';

@Component({
  selector: 'app-user-change-psw',
  templateUrl: './user-change-psw.component.html',
  styleUrls: ['./user-change-psw.component.css'],
})
export class UserChangePswComponent implements OnInit {
  /* FontAwesome Icons */
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faExclamationCircle = faExclamationCircle;
  faInfoCircle = faInfoCircle;

  /* Form Values */
  oldPassword: string;
  changePswFail: boolean = false;
  errorGeneric: boolean = false;
  newPassword: string;
  reNewPassword: string;

  /* Flag */
  newPasswordOk: boolean = true;
  reNewPasswordOk: boolean = true;
  oldPassMatchNewPasswordOk: boolean = true;
  oldPasswordOk: boolean = true;

  /* Models */
  passwordDTO: PasswordDTO = new PasswordDTO();
  profile: string;

  /* Message */
  okMsg: string = 'Modifica effettuata con successo!';
  errorMsg: string = '';

  uriDashboard: string;
  uriLogin: string;
  uriSignup: string;

  /* Link Homepage */
  homepage: string = environment.homeUrl;

  constructor(
    private authenticatorService: AuthenticationService,
    private route: Router,
    private validatorService: ValidatorService,
    private passwordService: UserPasswordRecoveryService,
    private verifySessionService: VerifySessionService
  ) {
    if (
      this.route.getCurrentNavigation() !== null &&
      this.route.getCurrentNavigation().extras.state !== undefined
    ) {
      this.profile = this.route.getCurrentNavigation().extras.state.profile;
    } else {
      this.route.navigate([
        '/externalRedirect',
        { externalUrl: this.homepage },
      ]);
    }
    this.setUri();
  }

  ngOnInit(): void {
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

  /* --- METHODS --- */
  /* --- CHECKS --- */

  checkNewPassword() {
    this.oldPassMatchNewPasswordOk = true;
    this.newPasswordOk = this.validatorService.isValidPassword(
      this.newPassword
    );
  }

  checkOldPassword() {
    this.oldPasswordOk = this.validatorService.isValidPassword(
      this.oldPassword
    );
  }

  checkPasswordRetype() {
    this.reNewPasswordOk = this.validatorService.isValidPassRe(
      this.newPassword,
      this.reNewPassword
    );
  }

  checkMatchOldNewPsw() {
    this.oldPassMatchNewPasswordOk = this.validatorService.isValidNewPass(
      this.oldPassword,
      this.newPassword
    );
  }

  checkChangePswForm() {
    this.checkMatchOldNewPsw();
    this.checkPasswordRetype();
    return (
      this.oldPasswordOk &&
      this.newPasswordOk &&
      this.reNewPasswordOk &&
      this.oldPassMatchNewPasswordOk
    );
  }

  setUri() {
    switch (this.profile) {
      case 'company': {
        this.uriDashboard = '/company/cpyDashboard/';
        this.uriLogin = '/company/cpyLogin';
        this.uriSignup = '/company/cpySignup';
        break;
      }
      case 'employee': {
        this.uriDashboard = '/employee/empDashboard/';
        this.uriLogin = '/employee/empLogin';
        this.uriSignup = '/employee/empSignup';
        break;
      }
      case 'merchant': {
        this.uriDashboard = '/merchant/mrcDashboard/';
        this.uriLogin = '/merchant/mrcLogin';
        this.uriSignup = '/merchant/mrcSignup';
        break;
      }
    }
  }

  onSubmitChangePswForm() {
    this.passwordDTO.usrProfile = this.profile;
    this.passwordDTO.userId = this.authenticatorService.getLoggedUserId();
    this.passwordDTO.oldPsw = this.oldPassword;
    this.passwordDTO.newPsw = this.newPassword;

    if (this.checkChangePswForm()) {
      this.passwordService.passChange(this.passwordDTO).subscribe(
        (response) => {
          if (response.status === 'OK') {
            $('#modalModifyOK').modal('show');
          } else {
            this.errorMsg = 'Si è verificato un errore, riprovare!';
            $('#modalModifyErrors').modal('show');
          }
        },
        (error) => {
          this.errorMsg = 'Si è verificato un errore, riprovare!';
          $('#modalModifyErrors').modal('show');
        }
      );
    } else if (this.oldPassword === this.newPassword) {
      this.errorMsg = 'La vecchia e la nuova password non devono coincidere!';
      $('#modalModifyErrors').modal('show');
    } else if (this.newPassword !== this.reNewPassword) {
      this.errorMsg = 'Le password devono coincidere!';
      $('#modalModifyErrors').modal('show');
    } else {
      this.errorMsg = 'Si è verificato un errore, riprovare!';
      $('#modalModifyErrors').modal('show');
    }
  }

  onClickHomeButton() {
    this.route.navigate([
      '/externalRedirect',
      { externalUrl: this.homepage },
    ]);
  }

  logout() {
    this.verifySessionService.resetSession().subscribe((response) => {
      if (response.status === 'OK') {
        this.authenticatorService.clearSessionStorage();
        this.route.navigate([
          '/externalRedirect',
          { externalUrl: this.homepage },
        ]);
        /* this.route.navigate(['/home']); */
      }
    });
  }
}
