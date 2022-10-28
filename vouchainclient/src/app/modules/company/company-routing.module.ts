/* Default Imports */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Components Imports */
import { CpyDashboardComponent } from './components/cpy-dashboard/cpy-dashboard.component';
import { CpyEmployeesComponent } from './components/cpy-employees/cpy-employees.component';
import { CpyLoginComponent } from './components/cpy-login/cpy-login.component';
import { CpyModifyProfileComponent } from './components/cpy-modify-profile/cpy-modify-profile.component';
import { CpyOrdersComponent } from './components/cpy-orders/cpy-orders.component';
import { CpyOverviewComponent } from './components/cpy-overview/cpy-overview.component';
import { CpySignupComponent } from './components/cpy-signup/cpy-signup.component';
import { CpyTransactionsComponent } from './components/cpy-transactions/cpy-transactions.component';
import { CpyUploadContractComponent } from './components/cpy-upload-contract/cpy-upload-contract.component';
import { CpyVouchersComponent } from './components/cpy-vouchers/cpy-vouchers.component';
import { CpyWalletComponent } from './components/cpy-wallet/cpy-wallet.component';
import { CpyVetrinaComponent } from './components/cpy-vetrina/cpy-vetrina.component';
import { CpyPaymentComponent }  from  './components/cpy-payment/cpy-payment.component';
import { CpyGooglepayComponent }  from './components/cpy-googlepay/cpy-googlepay.component';
import  { CpyCashbackComponent  }  from './components/cpy-cashback/cpy-cashback.component';
import { CpyProfileComponent }  from './components/cpy-profile/cpy-profile.component';
import { CpyMovimentiComponent} from './components/cpy-movimenti/cpy-movimenti.component';
import { CpyCarteComponent }  from './components/cpy-carte/cpy-carte.component';
import { CpyBonificiComponent } from './components/cpy-bonifici/cpy-bonifici.component';
import { CpyBonificiSepaComponent } from './components/cpy-bonifici-sepa/cpy-bonifici-sepa.component';
import { CpySepapaymentComponent }  from './components/cpy-sepapayment/cpy-sepapayment.component' ;
/* Services */
import { RouteGuardService } from 'src/app/services/route-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/company/cpyLogin', pathMatch: 'full' },
  {
    path: 'cpyDashboard',
    component: CpyDashboardComponent,
    children: [
      {
        path: '',
        redirectTo: '/company/cpyDashboard/overview',
        pathMatch: 'full',
      },
      {
        path: 'employees',
        component: CpyEmployeesComponent,
       canActivate: [RouteGuardService],
        data: { roles: ['company'] },
      },
      {
        path: 'modifyProfile',
        component: CpyModifyProfileComponent,
        data: { roles: ['company'] },
      },
      {
        path: 'orders',
        component: CpyOrdersComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['company'] },
      },
      {
        path: 'overview',
        component: CpyOverviewComponent,
       canActivate: [RouteGuardService],
        data: { roles: ['company'] },
      },
      {
        path: 'transactions',
        component: CpyTransactionsComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['company'] },
      },
      {
        path: 'vouchers',
        component: CpyVouchersComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['company'] },
      },
      {
        path: 'wallet',
        component: CpyWalletComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['company'] },
      },
      {
        path: 'vetrina',
        component: CpyVetrinaComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['company'] },
      },
      {
        path: 'applepay',
        component: CpyPaymentComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['company'] },
      },
      {
        path: 'googlepay',
        component: CpyGooglepayComponent,
        canActivate: [RouteGuardService],
        data: { roles: ['company'] },
      },
      {
        path: 'cashback',
        component: CpyCashbackComponent,
        
        data: { roles: ['company'] },
      },
      {
        path: 'profile',
        component: CpyProfileComponent,
        
        data: { roles: ['company'] },
      },
      {
        path: 'movimenti',
        component: CpyMovimentiComponent,
      
        data: { roles: ['company'] },
      },
      {
        path: 'carte',
        component: CpyCarteComponent,
        
        data: { roles: ['company'] },
      },
      {
        path: 'bonifici',
        component: CpyBonificiComponent,
       
        data: { roles: ['company'] },
      },
         
      
      {
        path: 'bonificisepa',
        component: CpyBonificiSepaComponent,      
        data: { roles: ['company'] },
      },

      {
        path: 'sepapayment',
        component: CpySepapaymentComponent,    
        data: { roles: ['company'] },
      },
    ],
  },
  { path: 'cpyLogin', component: CpyLoginComponent },
  { path: 'cpySignup', component: CpySignupComponent },
  {
    path: 'cpyUploadCtr',
    component: CpyUploadContractComponent,
    canActivate: [RouteGuardService],
    data: { roles: ['company'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
