/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DTOList } from 'src/app/model/dto-list';
import { HttpClient } from '@angular/common/http';
import { MerchantDTO } from 'src/app/model/merchant-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmpShowMerchantsService {
  private restShowMerchantsUrl: string;

  constructor(
    private authenticatorService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restShowMerchantsUrl = environment.basicUrl + myGlobals.mrcShowList;
  }

  showMerchantsList() {
    let headers = this.authenticatorService.getMrcHeader();

    return this.httpClient.get<DTOList<MerchantDTO>>(
      this.restShowMerchantsUrl,
      { headers }
    );
  }
}
