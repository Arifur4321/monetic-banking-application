/*  Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DTOList } from 'src/app/model/dto-list';
import { HttpClient } from '@angular/common/http';
import { SimpleResponseDTO } from 'src/app/model/simple-response-dto';
import { TransactionDTO } from './../../../../model/transaction-dto';
import { TransactionRequestDTO } from './../../../../model/transaction-request-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CpyOrdersService {
  private restDeleteOrderUrl: string;
  private restOrderListUrl: string;

  constructor(
    private authService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restDeleteOrderUrl = environment.basicUrl + myGlobals.trcDeleteOrder;
    this.restOrderListUrl = environment.basicUrl + myGlobals.cpyOrdersList;
  }

  deleteOrderById(trcId: string) {
    let headers = this.authService.getTransactionHeader();

    return this.httpClient.get<SimpleResponseDTO>(
      this.restDeleteOrderUrl + '/' + trcId,
      { headers }
    );
  }

  getCpyOrdersList(transactionRequestDTO: TransactionRequestDTO) {
    let headers = this.authService.getTransactionHeader();

    return this.httpClient.post<DTOList<TransactionDTO>>(
      this.restOrderListUrl,
      transactionRequestDTO,
      { headers }
    );
  }
}
