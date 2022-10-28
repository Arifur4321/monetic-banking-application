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
export class EmpVouchersService {
  private headers = this.authenticatorService.getVoucherHeader();
  private restVouchersAllocationUrl: string;
  private restVouchersUrl: string;

  constructor(
    private authenticatorService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restVouchersAllocationUrl =
      environment.basicUrl + myGlobals.vouVouchersAllocation;
    this.restVouchersUrl =
      environment.basicUrl + myGlobals.empExpendableVoucher;
  }

  allocateVouchers(vchAllocations: VoucherAllocationDTO[]) {
    return this.httpClient.post<SimpleResponseDTO>(
      this.restVouchersAllocationUrl,
      vchAllocations,
      { headers: this.headers }
    );
  }

  getExpendableVouchersEmp() {
    return this.httpClient.get<DTOList<VoucherDTO>>(
      this.restVouchersUrl + '/' + this.authenticatorService.getLoggedUserId(),
      { headers: this.headers }
    );
  }
}
