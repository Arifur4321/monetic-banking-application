/* Default Imports */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/* Modules Imports */
import { EmployeeRoutingModule } from './employee-routing.module';
import { SharedModule } from '../shared/shared.module';

/* Components Imports */
import { EmpDashboardComponent } from './components/emp-dashboard/emp-dashboard.component';
import { EmpInvitationcodeComponent } from './components/emp-invitationcode/emp-invitationcode.component';
import { EmpLoginComponent } from './components/emp-login/emp-login.component';
import { EmpMerchantsComponent } from './components/emp-merchants/emp-merchants.component';
import { EmpModifyProfileComponent } from './components/emp-modify-profile/emp-modify-profile.component';
import { EmpNavbarComponent } from './components/emp-navbar/emp-navbar.component';
import { EmpOverviewComponent } from './components/emp-overview/emp-overview.component';
import { EmpSignupComponent } from './components/emp-signup/emp-signup.component';
import { EmpTransactionsComponent } from './components/emp-transactions/emp-transactions.component';
import { EmpVouchersComponent } from './components/emp-vouchers/emp-vouchers.component';
import { EmpWalletComponent } from './components/emp-wallet/emp-wallet.component';
import { EmpMenuComponent } from './components/emp-menu/emp-menu.component';
import { EmpSubmenuComponent } from './components/emp-submenu/emp-submenu.component';
import { EmpSubmenutwoComponent } from './components/emp-submenutwo/emp-submenutwo.component';
import { EmpProfileComponent } from './components/emp-profile/emp-profile.component';
import { EmpRubricaComponent } from './components/emp-rubrica/emp-rubrica.component';
import { EmpPaymentComponent } from './components/emp-payment/emp-payment.component';
import { EmpCashbackComponent } from './components/emp-cashback/emp-cashback.component';
import { GooglepayComponent } from './components/googlepay/googlepay.component';
import { EmpVetrinaComponent } from './components/emp-vetrina/emp-vetrina.component';

@NgModule({
  declarations: [
    EmpDashboardComponent,
    EmpInvitationcodeComponent,
    EmpLoginComponent,
    EmpMerchantsComponent,
    EmpModifyProfileComponent,
    EmpNavbarComponent,
    EmpOverviewComponent,
    EmpSignupComponent,
    EmpTransactionsComponent,
    EmpVouchersComponent,
    EmpWalletComponent,
    EmpMenuComponent,
    EmpSubmenuComponent,
    EmpSubmenutwoComponent,
    EmpProfileComponent,
    EmpRubricaComponent,
    EmpPaymentComponent,
    EmpCashbackComponent,
    GooglepayComponent,
    EmpVetrinaComponent,
  ],
  imports: [CommonModule, EmployeeRoutingModule, SharedModule],
})
export class EmployeeModule {}
