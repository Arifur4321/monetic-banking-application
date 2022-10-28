import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { ModalsManagerService } from './modals-manager.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService implements CanActivate {
  homepage = environment.homeUrl;

  constructor(
    private authenticatorService: AuthenticationService,
    private modalManager: ModalsManagerService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    /* console.warn('ROUTE GUARD WORKING?'); */
    if (
      !this.authenticatorService.isLogged() &&
      !this.authenticatorService.getProfile()
    ) {
      if (state.url.includes('company')) {
        /* console.warn('ROUTE GUARD NOT LOGGED IN COMPANY'); */

        this.router.navigate(['/company']);
         this.forbiddenAccess();

        return false;
      } else if (state.url.includes('employee')) {
        /* console.warn('ROUTE GUARD NOT LOGGED IN EMPLOYEE'); */

        this.router.navigate(['/employee']);
       this.forbiddenAccess();

        return false;
      } else if (state.url.includes('merchant')) {
        /* console.warn('ROUTE GUARD NOT LOGGED IN MERCHANT'); */

        this.router.navigate(['/merchant']);
        this.forbiddenAccess();

        return false;
      }

      /* console.warn('ROUTE GUARD NOT LOGGED'); */
      this.router.navigate([
        '/externalRedirect',
        { externalUrl: this.homepage },
      ]);
      return false;
    } else {
      if (route.data.roles == null || route.data.roles.length === 0) {
        /* console.warn('ROUTE GUARD OKAY NO PROFILE'); */

        return true;

      } else if (
        route.data.roles.some(
          (r) => r === this.authenticatorService.getProfile()
        )
      ) {
        /* console.warn('ROUTE GUARD OKAY PROFILE'); */
        return   true;
      } else {
        if (state.url.includes('company')) {
          /* console.warn('ROUTE GUARD FAILED IN COMPANY'); */

          this.router.navigate(['/company']);
          this.forbiddenAccess();
          return false;
        } else if (state.url.includes('employee')) {
          /* console.warn('ROUTE GUARD FAILED IN EMPLOYEE'); */

          this.router.navigate(['/employee']);
         this.forbiddenAccess();

          return false;
        } else if (state.url.includes('merchant')) {
          /* console.warn('ROUTE GUARD FAILED IN MERCHANT'); */

          this.router.navigate(['/merchant']);
        this.forbiddenAccess();

          return false;
        }
        /* console.warn('ROUTE GUARD FAILED'); */
        this.router.navigate([
          '/externalRedirect',
          { externalUrl: this.homepage },
        ]);

        this.forbiddenAccess();
       
        return false;
      
      }
    }
  }

  forbiddenAccess() {
    setTimeout(() => {
      this.modalManager.errorsModalGeneric(
        'ERRORS.ACCESS_DENIED',
        'ERRORS.ACCESS_DENIED_BODY'
      );
    }, 1);
  }
}
