/* Default Imports */
import { InjectionToken, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';

/* Components Imports */
import { HomepageComponent } from './components/homepage/homepage.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SessionManagerComponent } from './components/session-manager/session-manager.component';
import { UserChangePswComponent } from './components/user-change-psw/user-change-psw.component';
import { UserPasswordRecoveryComponent } from './components/user-password-recovery/user-password-recovery.component';
import { UserResetPasswordComponent } from './components/user-reset-password/user-reset-password.component';
import {EmpLoginComponent} from './modules/employee/components/emp-login/emp-login.component'  ;
import {EmpOverviewComponent}  from './modules/employee/components/emp-overview/emp-overview.component' ;

/* Services */
import { RouteGuardService } from './services/route-guard.service';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  { path: '', redirectTo: '/company/cpyLogin', pathMatch: 'full' },
  {
    path: 'changePsw',
    component: UserChangePswComponent,
     canActivate: [RouteGuardService],
    data: { roles: ['company', 'employee', 'merchant', 'user'] },
  },
  {
    path: 'company',
    loadChildren: () =>
      import('./modules/company/company.module').then((m) => m.CompanyModule),
  },
  {
    path: 'employee',
    loadChildren: () =>
      import('./modules/employee/employee.module').then(
        (m) => m.EmployeeModule
      ),
  },
  { path: 'home', component: HomepageComponent },
  {
    path: 'merchant',
    loadChildren: () =>
      import('./modules/merchant/merchant.module').then(
        (m) => m.MerchantModule
      ),
  },

  {
    path: 'session',
    component: SessionManagerComponent,
    canActivate: [RouteGuardService],
    data: { roles: ['company', 'employee', 'merchant', 'user'] },
  },

  { path: 'usrForgotPass', component: UserPasswordRecoveryComponent },
  
  { path: 'usrResetPass', component: UserResetPasswordComponent },
  
  {
    path: 'externalRedirect',
    resolve: {
      url: externalUrlProvider,
    },
    // We need a component here because we cannot define the route otherwise
    component: NotFoundComponent,
    canActivate: [externalUrlProvider],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [
    {
      provide: externalUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        const externalUrl = route.paramMap.get('externalUrl');
        window.open(externalUrl, '_self');
      },
    },
  ],
})

export class AppRoutingModule {

  
}
