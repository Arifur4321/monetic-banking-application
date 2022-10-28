/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DTOList } from 'src/app/model/dto-list';
import { HttpClient } from '@angular/common/http';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { TransactionRequestDTO } from 'src/app/model/transaction-request-dto';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { InvoiceDTO } from 'src/app/model/invoice-dto';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  /* Headers */
  private headers = this.authenticatorService.getTransactionHeader();

  /* REST URIs Endpoints */
  private restTransactionDetailUrl: string;
  private restTransactionExportUrl: string;
  private restTransactionsListUrl: string;
  private restTransactionsInvoiceUrl: string;

  /* REST URIs ENDPOINTS for visa apikey   */

  private restTransactionvisaapikeyUrl  : string ;

  constructor(
    private authenticatorService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restTransactionDetailUrl = environment.basicUrl + myGlobals.trcDetail;
    this.restTransactionExportUrl = environment.basicUrl + myGlobals.trcExport;
    this.restTransactionvisaapikeyUrl = environment.basicUrl + myGlobals.trcVisaAPI;
    this.restTransactionsListUrl = environment.basicUrl + myGlobals.trcList;
    this.restTransactionsInvoiceUrl = environment.basicUrl + myGlobals.trcInvoiceDownload;
  }

  convertB64StringToBlobAndDownload(
    b46Data: string,
    startDate?: string,
    endDate?: string
  ) {
    fetch('data:;base64,' + b46Data)
      .then((response) => response.blob())
      .then((response) => {
        if (startDate && endDate) {
          if (startDate !== endDate) {
            saveAs(
              response,
              'Storico_' +
                this.authenticatorService.getLoggedUserEmail().split('@')[0] +
                '_dal_' +
                startDate +
                '_al_' +
                endDate +
                '_' +
                new Date().toISOString().split('.')[0].replace(/T|:/g, '-') +
                '.xlsx'
            );
          } else {
            saveAs(
              response,
              'Storico_' +
                this.authenticatorService.getLoggedUserEmail().split('@')[0] +
                '_del_' +
                startDate +
                '_' +
                new Date().toISOString().split('.')[0].replace(/T|:/g, '-') +
                '.xlsx'
            );
          }
        } else {
          saveAs(
            response,
            'Storico_' +
              this.authenticatorService.getLoggedUserEmail().split('@')[0] +
              '_' +
              new Date().toISOString().split('.')[0].replace(/T|:/g, '-') +
              '.xlsx'
          );
        }
      });
  }

  convertAndDownloadInvoice(
    b46Data: string,
    extension: string,
    invoiceDate: string
  ) {
    fetch('data:;base64,' + b46Data)
      .then((response) => response.blob())
      .then((response) => {
          saveAs(
            response,
            new Date().toISOString().split('.')[0].replace(/T|:/g, '-') + '_' +
              this.authenticatorService.getLoggedUserEmail().split('@')[0] +
              '_invoice_' +
              invoiceDate +
              '.' + extension
          );
      });
  }

  getInvoice(trcId: string, type: string) {
    return this.httpClient.get<InvoiceDTO>(
      this.restTransactionsInvoiceUrl + '/' + trcId + '/' + type, { headers: this.headers });
  }

  exportTransaction(trcRequest: TransactionRequestDTO) {
    return this.httpClient.post<TransactionDTO>(
      this.restTransactionExportUrl,
      trcRequest,
      { headers: this.headers }
    );
  }

  //  visaapikey to call the api
  visaapikey (trcRequest  :  TransactionRequestDTO){

    return this.httpClient.post<TransactionDTO> (
      this.restTransactionvisaapikeyUrl,
      trcRequest,
      { headers: this.headers }

    );
  
  }

  showTransactionsList(trcRequest: TransactionRequestDTO) {
    return this.httpClient.post<DTOList<TransactionDTO>>(
      this.restTransactionsListUrl,
      trcRequest,
      { headers: this.headers }
    );
  }
}
