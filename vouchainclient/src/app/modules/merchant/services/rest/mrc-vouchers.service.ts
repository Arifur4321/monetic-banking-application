/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DTOList } from 'src/app/model/dto-list';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { TransactionRequestDTO } from 'src/app/model/transaction-request-dto';
import { VoucherAllocationDTO } from 'src/app/model/voucher-allocation-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MrcVouchersService {
  private headers: HttpHeaders;
  private restPastVouchersUrl: string;
  /* private restShowActiveVouchersUrl: string; */
  private restVouchersToRedeemUrl: string;
  private trcHeaders: HttpHeaders;

  constructor(
    private authService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.headers = this.authService.getVoucherHeader();
    this.restPastVouchersUrl = environment.basicUrl + myGlobals.trcRedeemedList;
    this.restVouchersToRedeemUrl =
      environment.basicUrl + myGlobals.vouVouchersAllocation;
    this.trcHeaders = this.authService.getTransactionHeader();
  }

  /* TODO check utilization */
  getExpendedVoucherMrc() {
    throw new Error('Method not implemented.');
  }

  /* Gets the list of the past orders */
  getReedemedVoucherOrdersList(trcRequestDTO: TransactionRequestDTO) {
    return this.httpClient.post<DTOList<TransactionDTO>>(
      this.restPastVouchersUrl,
      trcRequestDTO,
      { headers: this.trcHeaders }
    );
  }

  /* Redeems vouchers selection */
  redeemVoucherOrders(voucherAllocationDTO: VoucherAllocationDTO[]) {
    return this.httpClient.post<DTOList<SimpleResponseDTO>>(
      this.restVouchersToRedeemUrl,
      voucherAllocationDTO,
      { headers: this.headers }
    );
  }
}
