/* Default Imports */
import { Injectable } from '@angular/core';

/* Custom Imports */
import * as myGlobals from 'src/globals/globals';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EmployeeDTO } from 'src/app/model/employee-dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmpInvitationcodeService {
  private headers: HttpHeaders;
  private restCheckInvCodeUrl: string;

  constructor(
    private authService: AuthenticationService,
    private httpClient: HttpClient
  ) {
    this.headers = this.authService.getEmpHeader();
    this.restCheckInvCodeUrl =
      environment.basicUrl + myGlobals.empCheckInvitationCode;
  }

  checkInvitationCode(code: string) {
    return this.httpClient.get<EmployeeDTO>(
      this.restCheckInvCodeUrl + '/' + code,
      { headers: this.headers }
    );
  }
}
