/*  Default Imports */
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
export class CpyLoginService {
  private restLoginUrl: string;

  constructor(
    private authService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.restLoginUrl = environment.basicUrl + myGlobals.cpyLogin;
  }
  
  authLoginCpy(cpyDTO: CompanyDTO) {
    let headers = this.authService.getCpyHeader();

    return this.httpClient.post<CompanyDTO>(this.restLoginUrl, cpyDTO, {
      headers,
    });
  }
}
