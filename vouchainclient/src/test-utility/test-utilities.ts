import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from 'src/app/app.module';

import { VoucherDTO } from 'src/app/model/voucher-dto';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { TransactionDTO } from 'src/app/model/transaction-dto';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { NgModel, FormsModule } from '@angular/forms';


export const imports = [
  HttpClientTestingModule,
  RouterTestingModule,
  FormsModule,
  TranslateModule.forRoot({
    defaultLanguage: 'it',
    loader: {
      deps: [HttpClient],
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
    }
  })]


export class Helper {

  createVoucherArray(n: number) {
    let array : Array<VoucherDTO> = new Array();
    for (let i = 0; i < n; i++) {
      let a: VoucherDTO = new VoucherDTO();
      a.vchQuantity = (i+1).toString();
      a.vchValue = (i+1).toString();
      a.vchName = 'Voucher_da_' + i+1 + '_2020_12_12';
      a.vchCreationDate = '2020-03-03'
      a.vchEndDate = '2020-12-12';
      a.companyId = '1';
      array[i] = a;
    }
    return array;
  }

  createEmployeeArray(n: number) {
    let array : Array<EmployeeDTO> = new Array();
    for (let i = 0; i < n; i++) {
      let a: EmployeeDTO = new EmployeeDTO();

      array[i] = a;
    }
    return array;
  }

  createTransactionArray(n: number) {
    let array : Array<TransactionDTO>= new Array();
    for (let i = 0; i < n; i++) {
      let a: TransactionDTO = new TransactionDTO();
      let vouchers = this.createVoucherArray(3);
      a.trcDate = '2020-03-03';
      a.voucherList = vouchers;
      a.trcId = (i+1).toString();
      a.trcValue = '20';
      if (i%2 === 0) {
        a.trcType = 'ALL';
        a.trcCancDate = null;
        a.trcPayed = 'payed';
      } else {
        a.trcType = 'ACV';
        a.trcCancDate = 'prova';
      }
      array[i] = a;
    }
    return array;
  }

  createMerchantArray(n: number) {
    let array : Array<MerchantDTO> = new Array();
    for (let i = 0; i < n; i++) {
      let a: MerchantDTO = new MerchantDTO();
      
      array[i] = a;
    }
    return array;
  }

  findButtonByText(buttons, text:String){
    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].nativeElement.innerText === text) {
        return buttons[i].nativeElement;
      }
    }
  }


/*createFileList(){
  const blob = new Blob([""], { type: "pdf" });
  blob["lastModifiedDate"] = "";
  blob["name"] = "filename";
  const file = <File>blob;
  const fileList : FileList = {
    0: file,
    1: file,
    length: 2,
    item: (index: number) => file
  };
return fileList;
}*/



}

