/* --- DEFAULTS IMPORTS --- */
import { Component, OnInit } from '@angular/core';

/* vvv CUSTOM IMPORTS vvv */

/* Custom Messages */
import * as myMessages from 'src/globals/messages';

/* Environment */
import { environment } from 'src/environments/environment';

/* jQuery */
declare var $: any;

/* Models */
import { CompanyDTO } from 'src/app/model/company-dto';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { MerchantDTO } from 'src/app/model/merchant-dto';

/* Router */
import { ActivatedRoute, Router } from '@angular/router';

/* Services */
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CpyLoginService } from 'src/app/modules/company/services/rest/cpy-login.service';
import { EmpLoginService } from 'src/app/modules/employee/services/rest/emp-login.service';
import { ModalsManagerService } from 'src/app/services/modals-manager.service';
import { MrcLoginService } from 'src/app/modules/merchant/services/rest/mrc-login.service';
import { VerifySessionService } from 'src/app/services/rest/verify-session.service';

/* ^^^ CUSTOM IMPORTS ^^^ */

@Component({
  selector: 'app-session-manager',
  templateUrl: './session-manager.component.html',
  styleUrls: ['./session-manager.component.css'],
})
export class SessionManagerComponent implements OnInit {
  /* --- ATTRIBUTES --- */
  homepage = environment.homeUrl;
  loginDTO;
  profile: string;
  sessionMessage: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private authenticatorService: AuthenticationService,
    private cpyLoginService: CpyLoginService,
    private empLoginService: EmpLoginService,
    private modalManager: ModalsManagerService,
    private mrcLoginService: MrcLoginService,
    private router: Router,
    private verifySessionService: VerifySessionService
  ) {
    this.sessionMessage = this.activateRoute.snapshot.queryParamMap.get(
      'session_msg'
    );

    if (
      this.router.getCurrentNavigation() !== null &&
      this.router.getCurrentNavigation().extras.state !== undefined
    ) {
      if (
        this.router.getCurrentNavigation().extras.state.loginDTO instanceof
        CompanyDTO
      ) {
        this.loginDTO = this.router.getCurrentNavigation().extras.state.loginDTO;
        this.profile = 'company';
      } else if (
        this.router.getCurrentNavigation().extras.state.loginDTO instanceof
        EmployeeDTO
      ) {
        this.loginDTO = this.router.getCurrentNavigation().extras.state.loginDTO;
        this.profile = 'employee';
      } else if (
        this.router.getCurrentNavigation().extras.state.loginDTO instanceof
        MerchantDTO
      ) {
        this.loginDTO = this.router.getCurrentNavigation().extras.state.loginDTO;
        this.profile = 'merchant';
      } else {
        if (!this.authenticatorService.getLoggedUserEmail()) {
          this.router.navigate([
            '/externalRedirect',
            { externalUrl: this.homepage },
          ]);
        }
      }
    } else {
      if (!this.authenticatorService.getLoggedUserEmail()) {
        this.router.navigate([
          '/externalRedirect',
          { externalUrl: this.homepage },
        ]);
      }
    }
  }

  ngOnInit(): void {}

  goToHome() {
    if (this.sessionMessage === myMessages.sessionExpired) {
      if (this.loginDTO) {
        this.verifySessionService
          .resetSession(this.loginDTO.usrEmail)
          .subscribe(
            (response) => {
              if (response.status === 'OK') {
                this.authenticatorService.clearSessionStorage();

                this.router.navigate([
                  '/externalRedirect',
                  { externalUrl: this.homepage },
                ]);
              } else {
                /* In case of generic error from back-end (NOTE: it should not happen, but just in case we redirect the user to the homepage) */
                this.modalManager.errorsModalGeneric(
                  'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
                  'ERRORS.GENERIC'
                );

                $('#vouchain-modal-errors').one('hidden.bs.modal', function (
                  e
                ) {
                  this.router.navigate([
                    '/externalRedirect',
                    { externalUrl: this.homepage },
                  ]);
                });
              }
            },
            (error) => {
              /* In case of generic HTTP error */
              this.modalManager.errorsModalGeneric(
                'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
                'ERRORS.GENERIC'
              );

              $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
                this.router.navigate([
                  '/externalRedirect',
                  { externalUrl: this.homepage },
                ]);
              });
            }
          );
      } else {
        this.verifySessionService.resetSession().subscribe(
          (response) => {
            if (response.status === 'OK') {
              this.authenticatorService.clearSessionStorage();

              this.router.navigate([
                '/externalRedirect',
                { externalUrl: this.homepage },
              ]);
            } else {
              /* In case of generic error from back-end (NOTE: it should not happen, but just in case we redirect the user to the homepage) */
              this.modalManager.errorsModalGeneric(
                'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
                'ERRORS.GENERIC'
              );

              $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
                this.router.navigate([
                  '/externalRedirect',
                  { externalUrl: this.homepage },
                ]);
              });
            }
          },
          (error) => {
            /* In case of generic HTTP error */
            this.modalManager.errorsModalGeneric(
              'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
              'ERRORS.GENERIC'
            );

            $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
              this.router.navigate([
                '/externalRedirect',
                { externalUrl: this.homepage },
              ]);
            });
          }
        );
      }
    } else {
      this.router.navigate([
        '/externalRedirect',
        { externalUrl: this.homepage },
      ]);
    }
  }

  reconnect() {
    this.verifySessionService
      .forceUpdateSession(
        this.authenticatorService.getLoggedUserEmail() || this.loginDTO.usrEmail
      )
      .subscribe(
        (response) => {
          if (response.status === 'OK') {
            switch (this.profile) {
              case 'company':
                this.cpyLoginService.authLoginCpy(this.loginDTO).subscribe(
                  (response) => {
                    if (response.status === 'OK') {
                      this.authenticatorService.setUserSession(response.usrId);
                      this.authenticatorService.setEmailSession(
                        response.usrEmail
                      );
                      this.authenticatorService.setProfile('company');
                      this.authenticatorService.setSessionId();

                      /* Check if it's first login */
                      if (response.cpyContractChecked === 'true') {
                        /* Navigate user to the dashboard */
                        this.router.navigate(['company/cpyDashboard']);
                      } else if (response.cpyContractChecked === 'false') {
                        /* Navigate user to upload a contract */
                        this.router.navigate(['company/cpyUploadCtr']);
                      }
                    } else {
                      /* console.log(response.errorDescription); */
                      /* In case of generic error from back-end (NOTE: it should not happen, but just in case we redirect the user to the homepage) */
                      this.modalManager.errorsModalGeneric(
                        'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
                        'ERRORS.GENERIC'
                      );

                      $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
                        this.router.navigate([
                          '/externalRedirect',
                          { externalUrl: this.homepage },
                        ]);
                      });
                    }
                  },
                  (error) => {
                    /* In case of generic HTTP error */
                    this.modalManager.errorsModalGeneric(
                      'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
                      'ERRORS.GENERIC'
                    );

                    $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
                      this.router.navigate([
                        '/externalRedirect',
                        { externalUrl: this.homepage },
                      ]);
                    });
                  }
                );
                break;

              case 'employee':
                this.empLoginService.authLoginEmp(this.loginDTO).subscribe(
                  (response) => {
                    if (response.status === 'OK') {
                      this.authenticatorService.setUserSession(response.usrId);
                      this.authenticatorService.setEmailSession(
                        response.usrEmail
                      );
                      this.authenticatorService.setProfile('employee');
                      this.authenticatorService.setSessionId();

                      this.router.navigate(['/employee/empDashboard/']);
                    } else {
                      /* console.log(response.errorDescription); */
                      /* In case of generic error from back-end (NOTE: it should not happen, but just in case we redirect the user to the homepage) */
                      this.modalManager.errorsModalGeneric(
                        'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
                        'ERRORS.GENERIC'
                      );

                      $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
                        this.router.navigate([
                          '/externalRedirect',
                          { externalUrl: this.homepage },
                        ]);
                      });
                    }
                  },
                  (error) => {
                    /* In case of generic HTTP error */
                    this.modalManager.errorsModalGeneric(
                      'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
                      'ERRORS.GENERIC'
                    );

                    $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
                      this.router.navigate([
                        '/externalRedirect',
                        { externalUrl: this.homepage },
                      ]);
                    });
                  }
                );
                break;

              case 'merchant':
                this.mrcLoginService.authLoginMrc(this.loginDTO).subscribe(
                  (response) => {
                    if (response.status === 'OK') {
                      this.authenticatorService.setUserSession(response.usrId);
                      this.authenticatorService.setEmailSession(
                        response.usrEmail
                      );
                      this.authenticatorService.setProfile('merchant');
                      this.authenticatorService.setSessionId();

                      this.router.navigate(['/merchant/mrcDashboard/']);
                    } else {
                      /* console.log(response.errorDescription); */
                      /* In case of generic error from back-end (NOTE: it should not happen, but just in case we redirect the user to the homepage) */
                      this.modalManager.errorsModalGeneric(
                        'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
                        'ERRORS.GENERIC'
                      );

                      $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
                        this.router.navigate([
                          '/externalRedirect',
                          { externalUrl: this.homepage },
                        ]);
                      });
                    }
                  },
                  (error) => {
                    /* In case of generic HTTP error */
                    this.modalManager.errorsModalGeneric(
                      'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
                      'ERRORS.GENERIC'
                    );

                    $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
                      this.router.navigate([
                        '/externalRedirect',
                        { externalUrl: this.homepage },
                      ]);
                    });
                  }
                );
                break;

              default:
                switch (this.authenticatorService.getProfile()) {
                  case 'company':
                    this.router.navigate(['/company']);
                    break;

                  case 'employee':
                    this.router.navigate(['/employee']);
                    break;

                  case 'merchant':
                    this.router.navigate(['/merchant']);
                    break;

                  default:
                    this.router.navigate([
                      '/externalRedirect',
                      { externalUrl: this.homepage },
                    ]);
                    break;
                }
                break;
            }
          } else {
            /* In case of generic error from back-end (NOTE: it should not happen, but just in case we redirect the user to the homepage) */
            this.modalManager.errorsModalGeneric(
              'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
              'ERRORS.GENERIC'
            );

            $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
              this.router.navigate([
                '/externalRedirect',
                { externalUrl: this.homepage },
              ]);
            });
          }
        },
        (error) => {
          /* In case of generic HTTP error */
          this.modalManager.errorsModalGeneric(
            'MODALS.HEADER.GENERIC.ERRORS.SESSION_GENERIC_TITLE',
            'ERRORS.GENERIC'
          );

          $('#vouchain-modal-errors').one('hidden.bs.modal', () => {
            this.router.navigate([
              '/externalRedirect',
              { externalUrl: this.homepage },
            ]);
          });
        }
      );
  }
}
