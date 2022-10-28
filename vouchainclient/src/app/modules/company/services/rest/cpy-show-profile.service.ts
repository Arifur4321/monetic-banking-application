/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CompanyDTO } from 'src/app/model/company-dto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CpyShowProfileService {
  private restModifyProfileUrl: string;
  private restShowProfileUrl: string;

  constructor(
    private authenticatorService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restModifyProfileUrl = environment.basicUrl + myGlobals.cpyModProfile;
    this.restShowProfileUrl = environment.basicUrl + myGlobals.cpyShowProfile;
  }

  cpyModifyProfile(newCompanyDto: CompanyDTO) {
    let headers = this.authenticatorService.getCpyHeader();

    return this.httpClient.post<CompanyDTO>(
      this.restModifyProfileUrl,
      newCompanyDto,
      { headers }
    );
  }

  getProfileDetails(usrId: string) {
    let headers = this.authenticatorService.getCpyHeader();

    return this.httpClient.get<CompanyDTO>(
      this.restShowProfileUrl + '/' + usrId,
      { headers }
    );
  }

  getShowProfile() {
    let headers = this.authenticatorService.getCpyHeader();

    return this.httpClient.get<CompanyDTO>(
      this.restShowProfileUrl +
        '/' +
        this.authenticatorService.getLoggedUserId(),
      { headers }
    );
  }
}
