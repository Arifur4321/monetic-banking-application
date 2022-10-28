/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DTOList } from 'src/app/model/dto-list';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MrcWalletService {
  private headers: HttpHeaders;
  private restWalletUrl: string;

  constructor(
    private authService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.headers = this.authService.getVoucherHeader();
    this.restWalletUrl = environment.basicUrl + myGlobals.vouExpendedVoucher;
  }

  getExpendedVoucherMrc() {
    return this.httpClient.get<DTOList<VoucherDTO>>(
      this.restWalletUrl + '/' + this.authService.getLoggedUserId(),
      { headers: this.headers }
    );
  }
}
