/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
declare var $: any;
import * as myGlobals from 'src/globals/globals';
import * as myMessages from 'src/globals/messages';
import { AuthenticationService } from '../authentication.service';
import { HttpCancelService } from './http-cancel.service';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { VerifySessionService } from '../rest/verify-session.service';
import { environment } from 'src/environments/environment';
import { switchMap, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  originalRequestUrl: string;

  constructor(
    private authenticatorService: AuthenticationService,
    private httpCancelService: HttpCancelService,
    private router: Router,
    private verifySessionService: VerifySessionService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    /* console.log('vvv=== INTERCEPT ===vvv');
    console.log('Request --->>>', req);
    console.log('Next --->>>', next); */

    const REST_URIS_TO_MATCH =
      req.url.match(/companies\//) ||
      req.url.match(/employees\//) ||
      req.url.match(/merchants\//) ||
      req.url.match(/users\//) ||
      req.url.match(/vouchers\//) ||
      req.url.match(/transactions\//);

    const REST_URI_TO_NOT_MATCH_INV_CODE = !req.url.match(
      /checkInvitationCode\//
    );

    const REST_URI_TO_NOT_MATCH_MOD_PASS = !req.url.match(/modifyPassword\//);

    const REST_URI_TO_NOT_MATCH_CHANGE_PASS = !req.url.match(
      /changePassword\//
    );

    const REST_URI_TO_NOT_MATCH_SIGNUPS = !req.url.match(/SignUp/);

    const REST_URI_TO_NOT_MATCH_EMPLOYEE_CONFIRMATION = !req.url.match(
      /employeeConfirmation/
    );

    if (
      req.url === environment.basicUrl + myGlobals.cpyLogin ||
      req.url === environment.basicUrl + myGlobals.empLogin ||
      req.url === environment.basicUrl + myGlobals.mrcLogin
    ) {
      this.originalRequestUrl = req.url;
    }

    if (
      REST_URIS_TO_MATCH &&
      REST_URI_TO_NOT_MATCH_INV_CODE &&
      REST_URI_TO_NOT_MATCH_MOD_PASS &&
      REST_URI_TO_NOT_MATCH_CHANGE_PASS &&
      REST_URI_TO_NOT_MATCH_SIGNUPS &&
      REST_URI_TO_NOT_MATCH_EMPLOYEE_CONFIRMATION
    ) {
      let modReq = req.clone({
        body: {
          forceUpdate: 'false',
          sessionId:
            this.authenticatorService.getSessionId() ||
            this.authenticatorService.sessionId,
          username:
            this.authenticatorService.getLoggedUserEmail() || req.body.usrEmail,
        },
        headers: this.authenticatorService.getUsrHeader(),
        method: 'POST',
        url: environment.basicUrl + myGlobals.verifySession,
      });
      /* console.log('Modified Request --->>>', modReq); */

      if (!this.authenticatorService.getProfile()) {
        this.authenticatorService.setProfile('user');
      }

      return this.verifySessionService.verifySession(modReq.body).pipe(
        switchMap((response) => {
          /* console.log('Response --->>>', response); */
          if (response.status === 'OK') {
            /* console.log('Handling Original Request --->>>', req);
            console.log('^^^=== INTERCEPT ===^^^'); */
            return next
              .handle(req)
              .pipe(
                takeUntil(this.httpCancelService.onCancelPendingRequests())
              );
          } else {
            switch (response.errorDescription) {
              case myMessages.sessionExpired:
                /* console.warn(
                  'WARNING: Session Expired --->>>',
                  response.errorDescription
                ); */

                if (
                  req.url === environment.basicUrl + myGlobals.cpyLogin ||
                  req.url === environment.basicUrl + myGlobals.empLogin ||
                  req.url === environment.basicUrl + myGlobals.mrcLogin
                ) {
                  this.originalRequestUrl = '';

                  return next
                    .handle(req)
                    .pipe(
                      takeUntil(
                        this.httpCancelService.onCancelPendingRequests()
                      )
                    );
                } else {
                  this.originalRequestUrl = '';

                  this.router.navigate(['/session'], {
                    queryParams: { session_msg: response.errorDescription },
                    state: { loginDTO: req.body },
                  });

                  break;
                }

              case myMessages.notCorrespondingSession:
                /* console.warn(
                  'WARNING: Not Corresponding Session --->>>',
                  response.errorDescription
                ); */
                this.router.navigate(['/session'], {
                  queryParams: { session_msg: response.errorDescription },
                  state: { loginDTO: req.body },
                });
                break;

              case myMessages.genericServerError:
                /* console.warn(
                  'WARNING: Generic Server Error --->>>',
                  response.errorDescription
                ); */
                this.router.navigate(['/session'], {
                  queryParams: { session_msg: response.errorDescription },
                });
                break;

              default:
                /* console.warn(
                  'WARNING: Not Specificied Error --->>>',
                  response.errorDescription
                ); */
                this.router.navigate(['/session'], {
                  queryParams: { session_msg: response.errorDescription },
                });
                break;
            }
          }
          /* console.log('^^^=== INTERCEPT ===^^^'); */
          return next
            .handle(modReq)
            .pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
        })
      );
    } else {
      /* console.log('^^^=== NOT INTERCEPT ===^^^'); */
      return next.handle(req);
    }
  }
}
