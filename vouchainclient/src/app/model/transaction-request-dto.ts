export class TransactionRequestDTO {
    startDate: string; //yyyy-MM-dd
    endDate: string; //yyyy-MM-dd
    usrId: string;
    trcState: string; //confirmed-pending
    trcPayed:string; //payed, not_payed
    profile: string; //employee,company,merchant,customer
}
