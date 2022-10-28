/*  Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MrcShowProfileService {
  private restModifyProfileUrl: string;
  private restShowProfileUrl: string;

  constructor(
    private authenticatorService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restShowProfileUrl = environment.basicUrl + myGlobals.mrcShowProfile;
    this.restModifyProfileUrl = environment.basicUrl + myGlobals.mrcModProfile;
  }

  getProfileDetails(usrId: string) {
    let headers = this.authenticatorService.getMrcHeader();

    return this.httpClient.get<MerchantDTO>(
      this.restShowProfileUrl + '/' + usrId,
      { headers }
    );
  }

  getShowProfile() {
    let headers = this.authenticatorService.getMrcHeader();

    return this.httpClient.get<MerchantDTO>(
      this.restShowProfileUrl +
        '/' +
        this.authenticatorService.getLoggedUserId(),
      { headers }
    );
  }

  mrcModifyProfile(mrcDTO: MerchantDTO) {
    let headers = this.authenticatorService.getMrcHeader();

    return this.httpClient.post<MerchantDTO>(
      this.restModifyProfileUrl,
      mrcDTO,
      { headers }
    );
  }
}
