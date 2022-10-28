/* Default Imports */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

/* Modules Imports */
import { MerchantRoutingModule } from './merchant-routing.module';
import { SharedModule } from '../shared/shared.module';

/* Components Imports */
import { MrcDashboardComponent } from './components/mrc-dashboard/mrc-dashboard.component';
import { MrcInvoiceComponent } from './components/mrc-invoice/mrc-invoice.component';
import { MrcLoginComponent } from './components/mrc-login/mrc-login.component';
import { MrcModifyProfileComponent } from './components/mrc-modify-profile/mrc-modify-profile.component';
import { MrcNavbarComponent } from './components/mrc-navbar/mrc-navbar.component';
import { MrcOverviewComponent } from './components/mrc-overview/mrc-overview.component';
import { MrcSignupComponent } from './components/mrc-signup/mrc-signup.component';
import { MrcTransactionsComponent } from './components/mrc-transactions/mrc-transactions.component';
import { MrcWalletComponent } from './components/mrc-wallet/mrc-wallet.component';

@NgModule({
  declarations: [
    MrcDashboardComponent,
    MrcInvoiceComponent,
    MrcLoginComponent,
    MrcModifyProfileComponent,
    MrcNavbarComponent,
    MrcOverviewComponent,
    MrcSignupComponent,
    MrcTransactionsComponent,
    MrcWalletComponent,
  ],
  imports: [CommonModule, MerchantRoutingModule, SharedModule],
})
export class MerchantModule {}
