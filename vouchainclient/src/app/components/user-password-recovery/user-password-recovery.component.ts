import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserPasswordRecoveryService } from 'src/app/services/rest/user-password-recovery.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidatorService } from 'src/app/services/validator.service';

/* jQuery */
declare var $: any;

/* Environment */
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-user-password-recovery',
  templateUrl: './user-password-recovery.component.html',
  styleUrls: ['./user-password-recovery.component.css']
})
export class UserPasswordRecoveryComponent implements OnInit, OnDestroy {
  email: string;
  emailOk: boolean = true;
  emailFound: boolean = true;
  checkValidation: boolean = true;
  profile: string;
  urlLogin: string;

  homepage: string = environment.homeUrl;

  constructor(private usrPassRecService: UserPasswordRecoveryService,
              private route: Router,
              private validatorService: ValidatorService,
              private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.profile = this.activateRoute.snapshot.queryParamMap.get("profile_code");
    $('#forgotPassForm').show();
    $('#RecoveryMessage').hide();
    this.backToLogin();

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

  backToLogin() {
    if (this.profile === "company") {
      this.urlLogin = "/company/cpyLogin"
    } else if (this.profile === "employee") {
      this.urlLogin = "/employee/empLogin"
    } else {
      this.urlLogin = "/merchant/mrcLogin"
    }
  }


  emailValid() {
    this.emailFound = true;
    this.checkValidation = this.validatorService.isValidEmail(this.email);
    /* Apply Bootstrap is-invalid/is-valid classes based on validation status */
    if (!this.checkValidation) {
      $('input[name*="email"]').removeClass('is-valid');
      $('input[name*="email"]').addClass('is-invalid');
    } else {
      $('input[name*="email"]').removeClass('is-invalid');
      $('input[name*="email"]').addClass('is-valid');
    }
  }

  onSubmitEmail() {
    if (this.email) {
      this.emailFound = true;
      this.emailOk = this.validatorService.isValidEmail(this.email);


      if (this.emailOk) {
        this.usrPassRecService.passRecoveryEmail(this.email, this.profile).subscribe((response) => {
          if (response.status === "OK") {

            $('#forgotPassForm').hide();
            $('#RecoveryMessage').show();

          }
          else {
            this.emailFound = false;

          }
        }, (err) => {
          this.emailFound = false;
        });
      }
    } else {
      this.emailFound = false;
    }

  }

  /* Button back home */
  onClickHomeButton() {
    this.route.navigate([
      '/externalRedirect',
      { externalUrl: this.homepage },
    ]);
  }

 

}
