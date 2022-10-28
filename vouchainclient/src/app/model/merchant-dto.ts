export class MerchantDTO {
    /* controllare i campi */
    errorDescription: string;
    status: string;
    usrId: string;
    mrcChecked: number;
    usrBchAddress: string;
    usrPrivateKey: string;
    usrActive: string;
    /* dati azienda */
    usrEmail: string;
    usrPassword: string;
    mrcRagioneSociale: string;
    mrcPartitaIva: string;
    mrcCodiceFiscale: string;
    /* richiedente e referente */
    mrcFirstNameReq: string;
    mrcLastNameReq: string;
    mrcRoleReq: string;
    mrcFirstNameRef: string;
    mrcLastNameRef: string;
    /* Sedi */
    mrcAddress: string;
    mrcCity: string;
    mrcProv: string;
    mrcZip: string;
    mrcPhoneNo: string;
    mrcOfficeName: string;
    mrcAddressOffice: string;
    mrcProvOffice: string;
    mrcCityOffice: string;
    mrcPhoneNoOffice: string;
    /* banca */
    mrcIban: string;
    mrcBank: string;
    /* mrcEmpNameIban: string; */
}
