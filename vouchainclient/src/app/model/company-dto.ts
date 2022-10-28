import { SessionTokenDTO } from './session-token-dto';

export class CompanyDTO {
  errorDescription: string;
  status: string;
  usrId: string;
  usrBchAddress: string;
  usrPrivateKey: string;
  usrEmail: string;
  usrPassword: string;
  cpyPec: string;
  cpyCodiceFiscale: string;
  cpyPartitaIva: string;
  cpyContractChecked: string;
  cpyContract: Blob;
  cpyActive: string;
  cpyHashedContract: Blob;
  cpyFirstNameRef: string;
  cpyLastNameRef: string;  
  cpyPhoneNoRef: string;
  cpyCuu: string;
  cpyRagioneSociale: string;
  cpyAddress: string;
  cpyCity: string;
  cpyProv: string;
  cpyZip: string;
  /* sessionToken: SessionTokenDTO; */
}
