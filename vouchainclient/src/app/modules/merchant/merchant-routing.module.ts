/* Default Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Components Imports */
import { MrcDashboardComponent } from './components/mrc-dashboard/mrc-dashboard.component';
import { MrcInvoiceComponent } from './components/mrc-invoice/mrc-invoice.component';
import { MrcLoginComponent } from './components/mrc-login/mrc-login.component';
import { MrcModifyProfileComponent } from './components/mrc-modify-profile/mrc-modify-profile.component';
import { MrcOverviewComponent } from './components/mrc-overview/mrc-overview.component';
import { MrcSignupComponent } from './components/mrc-signup/mrc-signup.component';
import { MrcTransactionsComponent } from './components/mrc-transactions/mrc-transactions.component';
import { MrcWalletComponent } from './components/mrc-wallet/mrc-wallet.component';

/* Services */
import { RouteGuardService } from 'src/app/services/route-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/merchant/mrcLogin', pathMatch: 'full' },
  { path: 'mrcLogin', component: MrcLoginComponent },
  { path: 'mrcSignup', component: MrcSignupComponent },
  {
    path: 'mrcDashboard',
    component: MrcDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: '/merchant/mrcDashboard/overview',
        pathMatch: 'full',
      },
      {
        path: 'modifyProfile',
        component: MrcModifyProfileComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['merchant'] },
      },
      {
        path: 'mrcWallet',
        component: MrcWalletComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['merchant'] },
      },
      {
        path: 'mrcInvoice',
        component: MrcInvoiceComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['merchant'] },
      },
      {
        path: 'overview',
        component: MrcOverviewComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['merchant'] },
      },
      {
        path: 'transactions',
        component: MrcTransactionsComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['merchant'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchantRoutingModule {}
