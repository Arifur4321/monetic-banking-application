/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DTOList } from 'src/app/model/dto-list';
import { HttpClient } from '@angular/common/http';
import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';
import { VoucherAllocationDTO } from 'src/app/model/voucher-allocation-dto';
import { VoucherDTO } from 'src/app/model/voucher-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CpyVouchersService {
  /* Headers */
  private headers = this.authenticatorService.getVoucherHeader();

  /* REST URIs Endpoints */
  private restNewVoucherTypeUrl: string;
  private restPurchaseVouchersUrl: string;
  private restShowActiveVouchersUrl: string;
  private restShowPurchasableVouchersUrl: string;
  private restVouchersAllocationUrl: string;

  constructor(
    private authenticatorService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restNewVoucherTypeUrl =
      environment.basicUrl + myGlobals.vouNewVoucherType;
    this.restPurchaseVouchersUrl =
      environment.basicUrl + myGlobals.vouPurchaseVouchers;
    this.restShowActiveVouchersUrl =
      environment.basicUrl + myGlobals.vouActiveVouchersList;
    this.restShowPurchasableVouchersUrl =
      environment.basicUrl + myGlobals.vouPurchasableList;
    this.restVouchersAllocationUrl =
      environment.basicUrl + myGlobals.vouVouchersAllocation;
  }

  allocateVouchers(vchAllocations: VoucherAllocationDTO[]) {
    return this.httpClient.post<SimpleResponseDTO>(
      this.restVouchersAllocationUrl,
      vchAllocations,
      { headers: this.headers }
    );
  }

  createNewVoucherType(voucher: VoucherDTO) {
    return this.httpClient.post<VoucherDTO>(
      this.restNewVoucherTypeUrl,
      voucher,
      { headers: this.headers }
    );
  }

  purchaseVouchers(vouchersList: VoucherDTO[]) {
    return this.httpClient.post<DTOList<VoucherDTO>>(
      this.restPurchaseVouchersUrl +
        '/' +
        this.authenticatorService.getLoggedUserId(),
      vouchersList,
      { headers: this.headers }
    );
  }

  showActiveVouchers() {
    return this.httpClient.get<DTOList<VoucherDTO>>(
      this.restShowActiveVouchersUrl +
        '/' +
        this.authenticatorService.getLoggedUserId(),
      { headers: this.headers }
    );
  }

  showPurchasableVouchers() {
    return this.httpClient.get<DTOList<VoucherDTO>>(
      this.restShowPurchasableVouchersUrl,
      { headers: this.headers }
    );
  }
}
