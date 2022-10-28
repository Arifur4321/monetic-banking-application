/* Default Imports */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/* Components Imports */
import { CpyDashboardComponent } from './components/cpy-dashboard/cpy-dashboard.component';
import { CpyEmployeesComponent } from './components/cpy-employees/cpy-employees.component';
import { CpyLoginComponent } from './components/cpy-login/cpy-login.component';
import { CpyModifyProfileComponent } from './components/cpy-modify-profile/cpy-modify-profile.component';
import { CpyNavbarComponent } from './components/cpy-navbar/cpy-navbar.component';
import { CpyOrdersComponent } from './components/cpy-orders/cpy-orders.component';
import { CpyOverviewComponent } from './components/cpy-overview/cpy-overview.component';
import { CpySignupComponent } from './components/cpy-signup/cpy-signup.component';
import { CpyTransactionsComponent } from './components/cpy-transactions/cpy-transactions.component';
import { CpyUploadContractComponent } from './components/cpy-upload-contract/cpy-upload-contract.component';
import { CpyVouchersComponent } from './components/cpy-vouchers/cpy-vouchers.component';
import { CpyWalletComponent } from './components/cpy-wallet/cpy-wallet.component';

/* Modules Imports */
import { CompanyRoutingModule } from './company-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CpySubmenuComponent } from './components/cpy-submenu/cpy-submenu.component';
import { CpyVetrinaComponent } from './components/cpy-vetrina/cpy-vetrina.component';
import { CpyPaymentComponent } from './components/cpy-payment/cpy-payment.component';
import { CpyGooglepayComponent } from './components/cpy-googlepay/cpy-googlepay.component';
import { CpyCashbackComponent } from './components/cpy-cashback/cpy-cashback.component';
import { CpyMenuComponent } from './components/cpy-menu/cpy-menu.component';
import { CpyProfileComponent } from './components/cpy-profile/cpy-profile.component';
import { CpyMovimentiComponent } from './components/cpy-movimenti/cpy-movimenti.component';
import { CpyCarteComponent } from './components/cpy-carte/cpy-carte.component';
import { CpyBonificiComponent } from './components/cpy-bonifici/cpy-bonifici.component';
import { CpyBonificiSepaComponent } from './components/cpy-bonifici-sepa/cpy-bonifici-sepa.component';
import { CpySepapaymentComponent } from './components/cpy-sepapayment/cpy-sepapayment.component';
import { CpySepapaymentServerComponent } from './components/cpy-sepapayment-server/cpy-sepapayment-server.component';

@NgModule({
  declarations: [
    CpyDashboardComponent,
    CpyEmployeesComponent,
    CpyLoginComponent,
    CpyModifyProfileComponent,
    CpyNavbarComponent,
    CpyOrdersComponent,
    CpyOverviewComponent,
    CpySignupComponent,
    CpyTransactionsComponent,
    CpyUploadContractComponent,
    CpyVouchersComponent,
    CpyWalletComponent,
    CpySubmenuComponent,
    CpyVetrinaComponent,
    CpyPaymentComponent,
    CpyGooglepayComponent,
    CpyCashbackComponent,
    CpyMenuComponent,
    CpyProfileComponent,
    CpyMovimentiComponent,
    CpyCarteComponent,
    CpyBonificiComponent,
    CpyBonificiSepaComponent,
    CpySepapaymentComponent,
    CpySepapaymentServerComponent,
  ],
  imports: [CommonModule, CompanyRoutingModule, SharedModule],
})
export class CompanyModule {}
