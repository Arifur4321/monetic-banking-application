import { Component, OnInit, OnDestroy } from '@angular/core';
import { ValidatorService } from 'src/app/services/validator.service';
import { error } from 'protractor';
import { UserPasswordRecoveryService } from 'src/app/services/rest/user-password-recovery.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

/* jQuery */
declare var $: any;

/* Environment */
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-reset-password',
  templateUrl: './user-reset-password.component.html',
  styleUrls: ['./user-reset-password.component.css']
})
export class UserResetPasswordComponent implements OnInit, OnDestroy {
  password: string;
  passwordRe: string;
  passOk: boolean = true;
  passReOk: boolean = true;
  errorMsg: string;
  resetCode: string;

  checkValidationPassword: boolean = true;
  checkValidationPasswordRetype: boolean = true;

  homepage: string = environment.homeUrl;

  constructor(private validatorService: ValidatorService,
              private usrPassRecService: UserPasswordRecoveryService,
              private activateRoute: ActivatedRoute,
              private translatorService: TranslateService) { }

  ngOnInit(): void {
    this.resetCode = this.activateRoute.snapshot.queryParamMap.get("reset_code");
    $('#modifyPassForm').show();
    $('#ModifyPasswordMessage').hide();

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

  checkPassword() {
    this.errorMsg = '';
    this.checkValidationPassword = this.validatorService.isValidPassword(this.password);
    /* Apply Bootstrap is-invalid/is-valid classes based on validation status */
    if (!this.checkValidationPassword) {
      $('input[name*="password"]').removeClass('is-valid');
      $('input[name*="password"]').addClass('is-invalid');
    } else {
      $('input[name*="password"]').removeClass('is-invalid');
      $('input[name*="password"]').addClass('is-valid');
    }
  }

  checkPasswordRetype() {
    this.errorMsg = '';
    this.checkValidationPasswordRetype = this.validatorService.isValidPassRe(this.password, this.passwordRe);
    /* Apply Bootstrap is-invalid/is-valid classes based on validation status */
    if (!this.checkValidationPasswordRetype) {
      $('input[name*="retype"]').removeClass('is-valid');
      $('input[name*="retype"]').addClass('is-invalid');
    } else {
      $('input[name*="retype"]').removeClass('is-invalid');
      $('input[name*="retype"]').addClass('is-valid');
    }
  }

  onSubmitPass() {
    if (this.password && this.passwordRe) {
      this.passOk = this.validatorService.isValidPassword(this.password);
      this.passReOk = this.validatorService.isValidPassRe(this.password, this.passwordRe);

      if (!this.passOk) {
        this.errorMsg = this.translatorService.instant('ERRORS.PASSWORD_SINTAX');

      } else if (!this.passReOk) {
        this.errorMsg = this.translatorService.instant('ERRORS.PASSWORD_RETYPE');
      } else {
        this.errorMsg = undefined;
        this.usrPassRecService.passModify(this.resetCode, this.password).subscribe((response) => {
          if (response.status === "OK") {
            $('#modifyPassForm').hide();
            $('#ModifyPasswordMessage').show();
          }
          else if (response.errorDescription === "login_not_validated") {
            this.errorMsg = this.translatorService.instant('ERRORS.PASSWORD');
          }
          else if (response.errorDescription === "no_user_found") {
            this.errorMsg = this.translatorService.instant('ERRORS.RESET_CODE');
          } else {
            this.errorMsg = this.translatorService.instant('ERRORS.GENERIC');
          }
        }, (err) => {
          this.errorMsg = this.translatorService.instant('ERRORS.GENERIC');
        });
      }
    } else {
      this.errorMsg = this.translatorService.instant('ERRORS.GENERIC');
    }
  }
}
