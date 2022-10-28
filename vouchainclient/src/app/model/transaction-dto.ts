import { VoucherDTO } from './voucher-dto';

export class TransactionDTO {
    usrIdDa: string;
    usrIdDaString: string;
    usrIdA: string;
    usrIdAString: string;
    trcId: string;
    trcTxId: string;
    trcType: string;
    trcDate: string;
    trcState: string; //confirmed - pending
    trcIban: string;
    trcPayed: string; //payed - not_payed
    //trcMailSent: string;
    trcCancDate: string;
    trcInvoice: Blob;
    transactionListExcel: string;
    trcValue: string;
    trcAccountHolder: string; 

    //transaction detail
    vchName: string;
   //trdQuantity: string;
    vchValue: string;
    voucherList: Array<VoucherDTO>;
    
    status: string;
}

