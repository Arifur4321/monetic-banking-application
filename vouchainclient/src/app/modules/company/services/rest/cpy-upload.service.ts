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
export class CpyUploadService {
  private restUploadUrl: string;

  constructor(
    private authenticatorService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restUploadUrl = environment.basicUrl + myGlobals.cpyUpContract;
  }

  public upload(formData: FormData) {
    let headers = this.authenticatorService.getCpyHeader();

    return this.httpClient.post<CompanyDTO>(
      this.restUploadUrl + '/' + this.authenticatorService.getLoggedUserId(),
      formData,
      { headers }
    );
  }
}
