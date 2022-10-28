/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MrcLoginService {
  private headers: HttpHeaders;
  private restLoginUrl: string;

  constructor(
    private authService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.headers = this.authService.getMrcHeader();
    this.restLoginUrl = environment.basicUrl + myGlobals.mrcLogin;
  }

  authLoginMrc(mrcDTO: MerchantDTO) {
    return this.httpClient.post<MerchantDTO>(this.restLoginUrl, mrcDTO, {
      headers: this.headers,
    });
  }
}
